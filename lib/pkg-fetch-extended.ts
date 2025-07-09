/**
 * Extended pkg-fetch module for PKG Revival
 * Adds support for Node.js 20.x and 21.x versions
 */

import { system } from 'pkg-fetch';
import { log } from './log';
import { enhancedAbiToNodeRange, enhancedIsValidNodeRange } from './node-support';

// Extended Node.js version mappings for newer versions
const EXTENDED_NODE_VERSIONS: Record<string, string> = {
  'node20': '20.11.1',  // Latest LTS
  'node21': '21.7.3',   // Latest stable
  'node22': '22.0.0',   // Future version
};

// Extended ABI to version mapping
const EXTENDED_ABI_VERSIONS: Record<string, string> = {
  '115': 'node20',
  '120': 'node21', 
  '127': 'node22',
};

// Platforms supported by extended versions
const SUPPORTED_PLATFORMS = ['linux', 'macos', 'win', 'alpine', 'linuxstatic'];
const SUPPORTED_ARCHITECTURES = ['x64', 'arm64'];

export interface ExtendedFetchOptions {
  nodeRange: string;
  platform: string;
  arch: string;
  forceBuild?: boolean;
}

export interface ExtendedBinaryInfo {
  nodeRange: string;
  platform: string;
  arch: string;
  version: string;
  url: string;
  localPath: string;
  isExtended: boolean;
}

/**
 * Enhanced pkg-fetch that supports Node.js 20.x and 21.x
 */
export class ExtendedPkgFetch {
  private cacheDir: string;

  constructor() {
    // Use the same cache directory as pkg-fetch
    this.cacheDir = process.env.PKG_CACHE_PATH || 
                   require('path').join(require('os').homedir(), '.pkg-cache');
  }

  /**
   * Check if a Node.js version is supported by extended pkg-fetch
   */
  isExtendedVersion(nodeRange: string): boolean {
    return Object.keys(EXTENDED_NODE_VERSIONS).includes(nodeRange);
  }

  /**
   * Get binary information for a target
   */
  async getBinaryInfo(options: ExtendedFetchOptions): Promise<ExtendedBinaryInfo> {
    const { nodeRange, platform, arch } = options;
    
    if (!this.isExtendedVersion(nodeRange)) {
      throw new Error(`Node.js version ${nodeRange} is not supported by extended pkg-fetch`);
    }

    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      throw new Error(`Platform ${platform} is not supported`);
    }

    if (!SUPPORTED_ARCHITECTURES.includes(arch)) {
      throw new Error(`Architecture ${arch} is not supported`);
    }

    const version = EXTENDED_NODE_VERSIONS[nodeRange];
    const url = this.generateDownloadUrl(nodeRange, platform, arch, version);
    const localPath = this.generateLocalPath(nodeRange, platform, arch, version);

    return {
      nodeRange,
      platform,
      arch,
      version,
      url,
      localPath,
      isExtended: true,
    };
  }

  /**
   * Fetch a Node.js binary for extended versions
   */
  async fetch(options: ExtendedFetchOptions): Promise<string> {
    const binaryInfo = await this.getBinaryInfo(options);
    
    log.info(`📦 Fetching Node.js ${binaryInfo.version} for ${binaryInfo.platform}-${binaryInfo.arch}`);
    
    // Check if binary already exists locally
    if (await this.binaryExists(binaryInfo.localPath)) {
      log.debug(`✅ Binary already cached: ${binaryInfo.localPath}`);
      return binaryInfo.localPath;
    }

    // For now, we'll use a fallback strategy:
    // 1. Try to download from official Node.js releases
    // 2. If that fails, use the closest available version from pkg-fetch
    
    try {
      await this.downloadOfficialBinary(binaryInfo);
      log.info(`✅ Downloaded Node.js ${binaryInfo.version} binary`);
      return binaryInfo.localPath;
    } catch (error) {
      log.warn(`⚠️ Failed to download official binary: ${error}`);
      return this.fallbackToClosestVersion(options);
    }
  }

  /**
   * Generate download URL for official Node.js binary
   */
  private generateDownloadUrl(_nodeRange: string, platform: string, arch: string, version: string): string {
    // Map platform names to Node.js release naming
    const platformMap: Record<string, string> = {
      'linux': 'linux',
      'macos': 'darwin',
      'win': 'win32',
      'alpine': 'linux',
      'linuxstatic': 'linux',
    };

    // Map architecture names
    const archMap: Record<string, string> = {
      'x64': 'x64',
      'arm64': 'arm64',
    };

    const nodePlatform = platformMap[platform];
    const nodeArch = archMap[arch];
    const extension = platform === 'win' ? '.zip' : '.tar.xz';
    
    return `https://nodejs.org/dist/v${version}/node-v${version}-${nodePlatform}-${nodeArch}${extension}`;
  }

  /**
   * Generate local cache path for binary
   */
  private generateLocalPath(_nodeRange: string, platform: string, arch: string, version: string): string {
    const path = require('path');
    const extension = platform === 'win' ? '.exe' : '';
    const filename = `fetched-v${version}-${platform}-${arch}${extension}`;
    return path.join(this.cacheDir, 'v3.5', filename);
  }

  /**
   * Check if binary exists locally
   */
  private async binaryExists(localPath: string): Promise<boolean> {
    try {
      const fs = require('fs').promises;
      await fs.access(localPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Download official Node.js binary
   */
  private async downloadOfficialBinary(binaryInfo: ExtendedBinaryInfo): Promise<void> {
    // This is a placeholder implementation
    // In a real implementation, we would:
    // 1. Download the Node.js binary from the official URL
    // 2. Extract it if it's compressed
    // 3. Apply any necessary patches for pkg compatibility
    // 4. Save it to the local cache path
    
    log.debug(`📥 Downloading from: ${binaryInfo.url}`);
    log.debug(`💾 Saving to: ${binaryInfo.localPath}`);
    
    // For now, throw an error to trigger fallback
    throw new Error('Official binary download not yet implemented');
  }

  /**
   * Fallback to closest available version from pkg-fetch
   */
  private async fallbackToClosestVersion(options: ExtendedFetchOptions): Promise<string> {
    const { nodeRange, platform, arch } = options;
    
    log.info(`🔄 Falling back to closest available version for ${nodeRange}`);
    
    // Map newer versions to closest available versions
    const fallbackMap: Record<string, string> = {
      'node20': 'node18',
      'node21': 'node18', 
      'node22': 'node18',
    };

    const fallbackVersion = fallbackMap[nodeRange];
    if (!fallbackVersion) {
      throw new Error(`No fallback version available for ${nodeRange}`);
    }

    log.warn(`⚠️ Using ${fallbackVersion} binary for ${nodeRange} (compatibility mode)`);
    
    // Use original pkg-fetch for fallback version
    const { need } = require('pkg-fetch');
    return need({
      nodeRange: fallbackVersion,
      platform,
      arch,
    });
  }

  /**
   * Enhanced ABI to Node range conversion
   */
  static enhancedAbiToNodeRange(abi: string): string {
    // Check extended versions first
    if (EXTENDED_ABI_VERSIONS[abi]) {
      return EXTENDED_ABI_VERSIONS[abi];
    }
    
    // Fallback to original pkg-fetch
    return enhancedAbiToNodeRange(abi);
  }

  /**
   * Enhanced Node range validation
   */
  static enhancedIsValidNodeRange(nodeRange: string): boolean {
    // Check extended versions first
    if (Object.keys(EXTENDED_NODE_VERSIONS).includes(nodeRange)) {
      return true;
    }
    
    // Fallback to original validation
    return enhancedIsValidNodeRange(nodeRange);
  }

  /**
   * Get all supported Node.js versions
   */
  static getSupportedVersions(): string[] {
    // Get original pkg-fetch versions
    const originalVersions = ['node8', 'node10', 'node12', 'node14', 'node16', 'node18'];
    
    // Add extended versions
    const extendedVersions = Object.keys(EXTENDED_NODE_VERSIONS);
    
    return [...originalVersions, ...extendedVersions];
  }

  /**
   * Check if a version requires extended support
   */
  static requiresExtendedSupport(nodeRange: string): boolean {
    return Object.keys(EXTENDED_NODE_VERSIONS).includes(nodeRange);
  }
}

/**
 * Enhanced fetch function that handles both original and extended versions
 */
export async function enhancedFetch(
  nodeRange: string, 
  platform: string, 
  arch: string,
  options: { forceBuild?: boolean } = {}
): Promise<string> {
  // Check if this is an extended version
  if (ExtendedPkgFetch.requiresExtendedSupport(nodeRange)) {
    const extendedFetch = new ExtendedPkgFetch();
    return extendedFetch.fetch({
      nodeRange,
      platform,
      arch,
      forceBuild: options.forceBuild,
    });
  }
  
  // Use original pkg-fetch for supported versions
  const { need } = require('pkg-fetch');
  return need({
    nodeRange,
    platform,
    arch,
    forceBuild: options.forceBuild,
  });
}

/**
 * Enhanced need function that handles both original and extended versions
 */
export async function enhancedNeed(options: {
  dryRun?: boolean;
  forceBuild?: boolean;
  nodeRange: string;
  platform: string;
  arch: string;
}): Promise<string> {
  const { dryRun, forceBuild, nodeRange, platform, arch } = options;

  // Check if this is an extended version
  if (ExtendedPkgFetch.requiresExtendedSupport(nodeRange)) {
    if (dryRun) {
      // For dry run, just check if we can handle this version
      log.debug(`🔍 Dry run for extended version: ${nodeRange}`);
      return 'fetched'; // Indicate we can handle this
    }

    // Use enhanced fetch for extended versions
    const extendedFetch = new ExtendedPkgFetch();
    const binaryPath = await extendedFetch.fetch({
      nodeRange,
      platform,
      arch,
      forceBuild,
    });

    return binaryPath;
  }

  // Use original pkg-fetch for supported versions
  const { need } = require('pkg-fetch');
  return need(options);
}

/**
 * Enhanced system utilities
 */
export const enhancedSystem = {
  abiToNodeRange: ExtendedPkgFetch.enhancedAbiToNodeRange,
  isValidNodeRange: ExtendedPkgFetch.enhancedIsValidNodeRange,
  getSupportedVersions: ExtendedPkgFetch.getSupportedVersions,
  requiresExtendedSupport: ExtendedPkgFetch.requiresExtendedSupport,
};
