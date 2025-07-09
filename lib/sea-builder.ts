/**
 * Single Executable Applications (SEA) Builder for PKG Revival
 * Implements Node.js 21+ native SEA support as an alternative to traditional PKG
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { existsSync } from 'fs-extra';
import { log } from './log';
import { getSEACapabilities, hasStableSEA } from './node-support';

export interface SEAConfig {
  main: string;
  output: string;
  disableExperimentalSEAWarning?: boolean;
  useSnapshot?: boolean;
  useCodeCache?: boolean;
  assets?: Record<string, string>;
}

export interface SEABuildOptions {
  entrypoint: string;
  output: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  assets?: string[];
  useSnapshot?: boolean;
  useCodeCache?: boolean;
  signBinary?: boolean;
}

export interface SEABuildResult {
  success: boolean;
  outputPath: string;
  size: number;
  buildTime: number;
  warnings: string[];
  errors: string[];
}

export class SEABuilder {
  private tempDir: string;
  
  constructor() {
    this.tempDir = path.join(process.cwd(), '.pkg-temp');
  }

  /**
   * Check if SEA building is available in the current environment
   */
  async canUseSEA(nodeVersion: string): Promise<boolean> {
    try {
      // Check if Node.js version supports SEA
      if (!hasStableSEA(nodeVersion)) {
        return false;
      }

      // Test if --experimental-sea-config flag is available
      const result = await this.runCommand('node', ['--help']);
      return result.stdout.includes('--experimental-sea-config');
    } catch {
      return false;
    }
  }

  /**
   * Build a single executable application using Node.js SEA
   */
  async build(options: SEABuildOptions): Promise<SEABuildResult> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      log.info('🚀 Building with Node.js SEA (faster, smaller)');
      
      // Validate SEA support
      const canUse = await this.canUseSEA(options.nodeVersion);
      if (!canUse) {
        throw new Error(`Node.js ${options.nodeVersion} does not support SEA or SEA is not available`);
      }

      // Create temporary directory
      await this.ensureTempDir();

      // Step 1: Create SEA configuration
      const seaConfig = await this.createSEAConfig(options);
      log.debug('SEA configuration created:', JSON.stringify(seaConfig, null, 2));

      // Step 2: Generate preparation blob
      await this.generateBlob(seaConfig);
      log.debug('SEA preparation blob generated');

      // Step 3: Copy Node.js binary
      const binaryPath = await this.copyNodeBinary(options);
      log.debug('Node.js binary copied to:', binaryPath);

      // Step 4: Remove signature (macOS/Windows)
      if (options.platform === 'macos' || options.platform === 'win') {
        await this.removeSignature(binaryPath, options.platform);
      }

      // Step 5: Inject blob using postject
      await this.injectBlob(binaryPath, seaConfig.output, options.platform);
      log.debug('Blob injected into binary');

      // Step 6: Sign binary (macOS/Windows)
      if (options.signBinary && (options.platform === 'macos' || options.platform === 'win')) {
        await this.signBinary(binaryPath, options.platform);
      }

      // Step 7: Move to final location
      const finalPath = await this.moveToFinalLocation(binaryPath, options.output);

      // Get file size
      const stats = await fs.stat(finalPath);
      const buildTime = Date.now() - startTime;

      log.info(`✅ SEA build completed in ${buildTime}ms, size: ${Math.round(stats.size / 1024 / 1024)}MB`);

      return {
        success: true,
        outputPath: finalPath,
        size: stats.size,
        buildTime,
        warnings,
        errors,
      };

    } catch (error) {
      const buildTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      
      log.error('❌ SEA build failed:', errorMessage);

      return {
        success: false,
        outputPath: '',
        size: 0,
        buildTime,
        warnings,
        errors,
      };
    } finally {
      // Cleanup temporary files
      await this.cleanup();
    }
  }

  /**
   * Create SEA configuration file
   */
  private async createSEAConfig(options: SEABuildOptions): Promise<SEAConfig> {
    const capabilities = getSEACapabilities(options.nodeVersion);
    
    const config: SEAConfig = {
      main: options.entrypoint,
      output: path.join(this.tempDir, 'sea-prep.blob'),
      disableExperimentalSEAWarning: true,
    };

    // Add optional features if supported
    if (capabilities.supportsSnapshot && options.useSnapshot) {
      config.useSnapshot = true;
    }

    if (capabilities.supportsCodeCache && options.useCodeCache !== false) {
      config.useCodeCache = true;
    }

    // Convert assets to SEA format
    if (capabilities.supportsAssets && options.assets) {
      config.assets = await this.convertAssetsToSEAFormat(options.assets);
    }

    // Write configuration file
    const configPath = path.join(this.tempDir, 'sea-config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    return config;
  }

  /**
   * Generate SEA preparation blob
   */
  private async generateBlob(config: SEAConfig): Promise<void> {
    const configPath = path.join(this.tempDir, 'sea-config.json');
    
    const result = await this.runCommand('node', [
      '--experimental-sea-config',
      configPath
    ]);

    if (result.exitCode !== 0) {
      throw new Error(`Failed to generate SEA blob: ${result.stderr}`);
    }
  }

  /**
   * Copy Node.js binary for modification
   */
  private async copyNodeBinary(options: SEABuildOptions): Promise<string> {
    const extension = options.platform === 'win' ? '.exe' : '';
    const binaryName = `${path.basename(options.output, path.extname(options.output))}${extension}`;
    const binaryPath = path.join(this.tempDir, binaryName);

    // Copy current Node.js binary
    await fs.copyFile(process.execPath, binaryPath);
    
    return binaryPath;
  }

  /**
   * Remove binary signature (required for injection)
   */
  private async removeSignature(binaryPath: string, platform: string): Promise<void> {
    if (platform === 'macos') {
      await this.runCommand('codesign', ['--remove-signature', binaryPath]);
    } else if (platform === 'win') {
      // Optional on Windows - signtool may not be available
      try {
        await this.runCommand('signtool', ['remove', '/s', binaryPath]);
      } catch {
        // Ignore if signtool is not available
      }
    }
  }

  /**
   * Inject SEA blob into binary using postject
   */
  private async injectBlob(binaryPath: string, blobPath: string, platform: string): Promise<void> {
    const args = [
      binaryPath,
      'NODE_SEA_BLOB',
      blobPath,
      '--sentinel-fuse',
      'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2'
    ];

    // Add macOS-specific argument
    if (platform === 'macos') {
      args.push('--macho-segment-name', 'NODE_SEA');
    }

    const result = await this.runCommand('npx', ['postject', ...args]);
    
    if (result.exitCode !== 0) {
      throw new Error(`Failed to inject blob: ${result.stderr}`);
    }
  }

  /**
   * Sign the binary after injection
   */
  private async signBinary(binaryPath: string, platform: string): Promise<void> {
    if (platform === 'macos') {
      await this.runCommand('codesign', ['--sign', '-', binaryPath]);
    } else if (platform === 'win') {
      // Optional on Windows
      try {
        await this.runCommand('signtool', ['sign', '/fd', 'SHA256', binaryPath]);
      } catch {
        // Ignore if signing fails
      }
    }
  }

  /**
   * Convert PKG-style assets to SEA format
   */
  private async convertAssetsToSEAFormat(assets: string[]): Promise<Record<string, string>> {
    const seaAssets: Record<string, string> = {};
    
    // For now, implement basic asset conversion
    // This would need to be enhanced to handle glob patterns like PKG
    for (const asset of assets) {
      if (existsSync(asset)) {
        const key = path.relative(process.cwd(), asset);
        seaAssets[key] = asset;
      }
    }
    
    return seaAssets;
  }

  /**
   * Move binary to final output location
   */
  private async moveToFinalLocation(tempPath: string, outputPath: string): Promise<string> {
    await fs.rename(tempPath, outputPath);
    return outputPath;
  }

  /**
   * Ensure temporary directory exists
   */
  private async ensureTempDir(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanup(): Promise<void> {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Run a command and return result
   */
  private async runCommand(command: string, args: string[]): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
  }> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { stdio: 'pipe' });
      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (exitCode) => {
        resolve({ exitCode: exitCode || 0, stdout, stderr });
      });
    });
  }
}
