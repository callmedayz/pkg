/**
 * Hybrid Builder for PKG Revival
 * Intelligently chooses between Node.js SEA and traditional PKG based on project requirements
 */

import { log } from './log';
import { SEABuilder, SEABuildOptions, SEABuildResult } from './sea-builder';
import { getBuildStrategy, validateTarget, getNodeVersionInfo } from './node-support';
import { Target } from './types';

export interface HybridBuildOptions {
  entrypoint: string;
  output: string;
  targets: Target[];
  assets?: string[];
  useSnapshot?: boolean;
  useCodeCache?: boolean;
  forceBuildMode?: 'sea' | 'traditional' | 'auto';
  crossCompile?: boolean;
  hasComplexRequires?: boolean;
  signBinary?: boolean;
}

export interface HybridBuildResult {
  success: boolean;
  results: Array<{
    target: Target;
    buildMode: 'sea' | 'traditional';
    result: SEABuildResult | any; // Traditional PKG result type
    outputPath: string;
  }>;
  totalTime: number;
  warnings: string[];
  errors: string[];
}

export interface BuildDecision {
  target: Target;
  buildMode: 'sea' | 'traditional';
  reason: string;
  canUseSEA: boolean;
  shouldUseSEA: boolean;
}

export class HybridBuilder {
  private seaBuilder: SEABuilder;

  constructor() {
    this.seaBuilder = new SEABuilder();
  }

  /**
   * Build executables for multiple targets using the best strategy for each
   */
  async build(options: HybridBuildOptions): Promise<HybridBuildResult> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];
    const results: HybridBuildResult['results'] = [];

    log.info('🔧 Starting hybrid build process...');

    try {
      // Analyze build decisions for each target
      const decisions = await this.analyzeBuildDecisions(options);
      
      // Log build strategy summary
      this.logBuildStrategySummary(decisions);

      // Build each target
      for (const decision of decisions) {
        try {
          const result = await this.buildSingleTarget(decision, options);
          results.push(result);
          
          if (result.result.success) {
            log.info(`✅ ${decision.target.nodeRange}-${decision.target.platform}-${decision.target.arch} built with ${decision.buildMode}`);
          } else {
            log.error(`❌ ${decision.target.nodeRange}-${decision.target.platform}-${decision.target.arch} failed`);
            errors.push(...result.result.errors || []);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(`Target ${decision.target.nodeRange}-${decision.target.platform}-${decision.target.arch}: ${errorMessage}`);
          log.error(`❌ Failed to build target: ${errorMessage}`);
        }
      }

      const totalTime = Date.now() - startTime;
      const successCount = results.filter(r => r.result.success).length;
      
      log.info(`🎯 Build completed: ${successCount}/${results.length} targets successful in ${totalTime}ms`);

      return {
        success: successCount === results.length,
        results,
        totalTime,
        warnings,
        errors,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      
      return {
        success: false,
        results,
        totalTime: Date.now() - startTime,
        warnings,
        errors,
      };
    }
  }

  /**
   * Analyze build decisions for all targets
   */
  private async analyzeBuildDecisions(options: HybridBuildOptions): Promise<BuildDecision[]> {
    const decisions: BuildDecision[] = [];

    for (const target of options.targets) {
      const decision = await this.decideBuildStrategy(target, options);
      decisions.push(decision);
    }

    return decisions;
  }

  /**
   * Decide the best build strategy for a specific target
   */
  private async decideBuildStrategy(target: Target, options: HybridBuildOptions): Promise<BuildDecision> {
    // Validate target first
    const validation = validateTarget(target);
    if (!validation.valid) {
      return {
        target,
        buildMode: 'traditional',
        reason: `Target validation failed: ${validation.reason}`,
        canUseSEA: false,
        shouldUseSEA: false,
      };
    }

    // Check if user forced a specific mode
    if (options.forceBuildMode && options.forceBuildMode !== 'auto') {
      const canUseSEA = await this.seaBuilder.canUseSEA(target.nodeRange);
      return {
        target,
        buildMode: options.forceBuildMode,
        reason: `User forced ${options.forceBuildMode} mode`,
        canUseSEA,
        shouldUseSEA: options.forceBuildMode === 'sea' && canUseSEA,
      };
    }

    // Check SEA availability
    const canUseSEA = await this.seaBuilder.canUseSEA(target.nodeRange);
    
    if (!canUseSEA) {
      return {
        target,
        buildMode: 'traditional',
        reason: `Node.js ${target.nodeRange} does not support SEA`,
        canUseSEA: false,
        shouldUseSEA: false,
      };
    }

    // Get recommended strategy
    const strategy = getBuildStrategy(target.nodeRange, {
      crossCompile: options.crossCompile,
      hasComplexRequires: options.hasComplexRequires,
      hasAssets: (options.assets?.length || 0) > 0,
    });

    let reason = '';
    let buildMode: 'sea' | 'traditional' = 'traditional';

    switch (strategy) {
      case 'sea':
        buildMode = 'sea';
        reason = 'Optimal for simple projects with stable SEA support';
        break;
      case 'traditional':
        buildMode = 'traditional';
        reason = 'Required for complex projects or cross-compilation';
        break;
      case 'hybrid':
        // For hybrid, prefer SEA if available and stable
        const nodeInfo = getNodeVersionInfo(target.nodeRange);
        if (nodeInfo.stableSEA) {
          buildMode = 'sea';
          reason = 'Using SEA for better performance (hybrid mode)';
        } else {
          buildMode = 'traditional';
          reason = 'Using traditional PKG for reliability (hybrid mode)';
        }
        break;
    }

    return {
      target,
      buildMode,
      reason,
      canUseSEA,
      shouldUseSEA: buildMode === 'sea',
    };
  }

  /**
   * Build a single target using the decided strategy
   */
  private async buildSingleTarget(
    decision: BuildDecision,
    options: HybridBuildOptions
  ): Promise<HybridBuildResult['results'][0]> {
    const targetOutput = this.generateTargetOutput(decision.target, options.output);

    if (decision.buildMode === 'sea') {
      const seaOptions: SEABuildOptions = {
        entrypoint: options.entrypoint,
        output: targetOutput,
        nodeVersion: decision.target.nodeRange,
        platform: decision.target.platform,
        arch: decision.target.arch,
        assets: options.assets,
        useSnapshot: options.useSnapshot,
        useCodeCache: options.useCodeCache,
        signBinary: options.signBinary,
      };

      const result = await this.seaBuilder.build(seaOptions);
      
      return {
        target: decision.target,
        buildMode: 'sea',
        result,
        outputPath: result.outputPath,
      };
    } else {
      // Traditional PKG build
      // This would integrate with the existing PKG build process
      // For now, return a placeholder that indicates traditional build is needed
      return {
        target: decision.target,
        buildMode: 'traditional',
        result: {
          success: false,
          outputPath: targetOutput,
          size: 0,
          buildTime: 0,
          warnings: [],
          errors: ['Traditional PKG build not yet integrated in hybrid builder'],
        },
        outputPath: targetOutput,
      };
    }
  }

  /**
   * Generate output path for a specific target
   */
  private generateTargetOutput(target: Target, baseOutput: string): string {
    const ext = target.platform === 'win' ? '.exe' : '';
    const baseName = path.basename(baseOutput, path.extname(baseOutput));
    const dir = path.dirname(baseOutput);
    
    return path.join(dir, `${baseName}-${target.nodeRange}-${target.platform}-${target.arch}${ext}`);
  }

  /**
   * Log build strategy summary
   */
  private logBuildStrategySummary(decisions: BuildDecision[]): void {
    const seaCount = decisions.filter(d => d.buildMode === 'sea').length;
    const traditionalCount = decisions.filter(d => d.buildMode === 'traditional').length;
    
    log.info(`📊 Build strategy: ${seaCount} SEA, ${traditionalCount} traditional`);
    
    for (const decision of decisions) {
      const icon = decision.buildMode === 'sea' ? '🚀' : '🔧';
      log.debug(`${icon} ${decision.target.nodeRange}-${decision.target.platform}-${decision.target.arch}: ${decision.buildMode} (${decision.reason})`);
    }
  }

  /**
   * Get build recommendations for a set of targets
   */
  async getRecommendations(targets: Target[]): Promise<{
    canUseSEA: number;
    shouldUseSEA: number;
    recommendations: string[];
  }> {
    const decisions = await Promise.all(
      targets.map(target => this.decideBuildStrategy(target, {
        entrypoint: '',
        output: '',
        targets: [],
      }))
    );

    const canUseSEA = decisions.filter(d => d.canUseSEA).length;
    const shouldUseSEA = decisions.filter(d => d.shouldUseSEA).length;
    
    const recommendations: string[] = [];
    
    if (shouldUseSEA > 0) {
      recommendations.push(`${shouldUseSEA} targets can benefit from SEA for faster builds and smaller outputs`);
    }
    
    if (canUseSEA < targets.length) {
      const unsupported = targets.length - canUseSEA;
      recommendations.push(`${unsupported} targets require traditional PKG (older Node.js versions or complex requirements)`);
    }
    
    if (shouldUseSEA === targets.length) {
      recommendations.push('All targets can use SEA - consider using --sea flag for optimal performance');
    }

    return {
      canUseSEA,
      shouldUseSEA,
      recommendations,
    };
  }
}

// Import path module
import path from 'path';
