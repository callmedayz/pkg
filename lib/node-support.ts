/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Enhanced Node.js version support for PKG revival
 * Extends pkg-fetch capabilities with Node.js 20.x and 21.x support
 * Includes SEA (Single Executable Applications) detection and integration
 */

import { system } from 'pkg-fetch';

// Extended ABI version mapping based on Node.js official registry
// Source: https://raw.githubusercontent.com/nodejs/node/main/doc/abi_version_registry.json
const EXTENDED_ABI_MAPPING: Record<string, string> = {
  // Original pkg-fetch mappings (for compatibility)
  'm14': 'node0.12',
  'm46': 'node4',
  'm47': 'node5', 
  'm48': 'node6',
  'm51': 'node7',
  'm57': 'node8',
  'm59': 'node9',
  'm64': 'node10',
  'm67': 'node11',
  'm72': 'node12',
  'm79': 'node13',
  'm83': 'node14',
  
  // Extended mappings for newer Node.js versions
  'm88': 'node15',
  'm93': 'node16',
  'm102': 'node17',
  'm108': 'node18',
  'm111': 'node19',
  'm115': 'node20',
  'm120': 'node21',
  'm127': 'node22',
  
  // Support for future versions (to be updated)
  'm131': 'node23',
  'm137': 'node24',
};

// Node.js versions that support SEA (Single Executable Applications)
const SEA_SUPPORTED_VERSIONS = ['node19', 'node20', 'node21', 'node22', 'node23', 'node24'];

// Node.js versions with stable SEA support
const SEA_STABLE_VERSIONS = ['node21', 'node22', 'node23', 'node24'];

export interface NodeVersionInfo {
  version: string;
  abi: number;
  supportsSEA: boolean;
  stableSEA: boolean;
  isSupported: boolean;
}

export interface SEACapabilities {
  hasNativeSEA: boolean;
  supportsAssets: boolean;
  supportsSnapshot: boolean;
  supportsCodeCache: boolean;
  requiresPostject: boolean;
}

/**
 * Enhanced ABI to Node range conversion with extended version support
 */
export function enhancedAbiToNodeRange(abi: string): string {
  // Try extended mapping first
  if (EXTENDED_ABI_MAPPING[abi]) {
    return EXTENDED_ABI_MAPPING[abi];
  }
  
  // Fallback to original pkg-fetch mapping
  return system.abiToNodeRange ? system.abiToNodeRange(abi) : abi;
}

/**
 * Enhanced Node range validation with support for newer versions
 */
export function enhancedIsValidNodeRange(nodeRange: string): boolean {
  if (nodeRange === 'latest') return true;
  if (!/^node/.test(nodeRange)) return false;
  
  // Check if it's a supported version
  const versionNumber = parseInt(nodeRange.replace('node', ''), 10);
  return versionNumber >= 8 && versionNumber <= 24; // Support Node.js 8-24
}

/**
 * Get detailed information about a Node.js version
 */
export function getNodeVersionInfo(nodeRange: string): NodeVersionInfo {
  const version = nodeRange.startsWith('node') ? nodeRange : `node${nodeRange}`;
  const versionNumber = parseInt(version.replace('node', ''), 10);
  
  // Find ABI version
  let abi = 0;
  for (const [abiStr, nodeVer] of Object.entries(EXTENDED_ABI_MAPPING)) {
    if (nodeVer === version) {
      abi = parseInt(abiStr.replace('m', ''), 10);
      break;
    }
  }
  
  return {
    version,
    abi,
    supportsSEA: SEA_SUPPORTED_VERSIONS.includes(version),
    stableSEA: SEA_STABLE_VERSIONS.includes(version),
    isSupported: versionNumber >= 8 && versionNumber <= 24,
  };
}

/**
 * Check if a Node.js version supports SEA
 */
export function supportsSEA(nodeRange: string): boolean {
  const info = getNodeVersionInfo(nodeRange);
  return info.supportsSEA;
}

/**
 * Check if a Node.js version has stable SEA support
 */
export function hasStableSEA(nodeRange: string): boolean {
  const info = getNodeVersionInfo(nodeRange);
  return info.stableSEA;
}

/**
 * Get SEA capabilities for a specific Node.js version
 */
export function getSEACapabilities(nodeRange: string): SEACapabilities {
  const info = getNodeVersionInfo(nodeRange);
  const versionNumber = parseInt(info.version.replace('node', ''), 10);
  
  if (!info.supportsSEA) {
    return {
      hasNativeSEA: false,
      supportsAssets: false,
      supportsSnapshot: false,
      supportsCodeCache: false,
      requiresPostject: false,
    };
  }
  
  // SEA capabilities by version
  const capabilities: SEACapabilities = {
    hasNativeSEA: true,
    supportsAssets: versionNumber >= 20, // Assets support added in Node.js 20
    supportsSnapshot: versionNumber >= 20, // Snapshot support added in Node.js 20
    supportsCodeCache: versionNumber >= 20, // Code cache support added in Node.js 20
    requiresPostject: true, // All SEA versions require postject for injection
  };
  
  return capabilities;
}

/**
 * Determine the best build strategy for a given Node.js version
 */
export function getBuildStrategy(nodeRange: string, options: {
  crossCompile?: boolean;
  hasComplexRequires?: boolean;
  hasAssets?: boolean;
}): 'sea' | 'traditional' | 'hybrid' {
  const info = getNodeVersionInfo(nodeRange);
  const { crossCompile = false, hasComplexRequires = false, hasAssets = false } = options;
  
  // Force traditional PKG for unsupported versions
  if (!info.isSupported) {
    return 'traditional';
  }
  
  // Force traditional PKG for cross-compilation (SEA doesn't support it)
  if (crossCompile) {
    return 'traditional';
  }
  
  // Force traditional PKG for complex requires (SEA has limitations)
  if (hasComplexRequires) {
    return 'traditional';
  }
  
  // Use SEA for stable versions with simple projects
  if (info.stableSEA && !hasComplexRequires) {
    return 'sea';
  }
  
  // Use hybrid approach for experimental SEA versions
  if (info.supportsSEA) {
    return 'hybrid';
  }
  
  // Default to traditional PKG
  return 'traditional';
}

/**
 * Get the current Node.js version information
 */
export function getCurrentNodeInfo(): NodeVersionInfo {
  const version = process.version.match(/^v(\d+)/)?.[1] || '0';
  return getNodeVersionInfo(`node${version}`);
}

/**
 * Check if the current Node.js version can build for a target version
 */
export function canBuildForTarget(targetNodeRange: string): boolean {
  const current = getCurrentNodeInfo();
  const target = getNodeVersionInfo(targetNodeRange);
  
  // Can always build for same or older versions
  const currentVersion = parseInt(current.version.replace('node', ''), 10);
  const targetVersion = parseInt(target.version.replace('node', ''), 10);
  
  return currentVersion >= targetVersion;
}

/**
 * Get recommended Node.js versions for development
 */
export function getRecommendedVersions(): {
  lts: string[];
  current: string;
  seaReady: string[];
} {
  return {
    lts: ['node18', 'node20'], // Current LTS versions
    current: 'node22', // Current stable version
    seaReady: ['node21', 'node22'], // Versions with stable SEA support
  };
}

/**
 * Validate if a target configuration is supported
 */
export function validateTarget(target: {
  nodeRange: string;
  platform: string;
  arch: string;
}): { valid: boolean; reason?: string } {
  const info = getNodeVersionInfo(target.nodeRange);
  
  if (!info.isSupported) {
    return {
      valid: false,
      reason: `Node.js version ${target.nodeRange} is not supported. Supported versions: 8-24`,
    };
  }
  
  // Add platform/arch validation if needed
  const supportedPlatforms = ['linux', 'macos', 'win', 'alpine', 'linuxstatic'];
  const supportedArchs = ['x64', 'arm64', 'x86'];
  
  if (!supportedPlatforms.includes(target.platform)) {
    return {
      valid: false,
      reason: `Platform ${target.platform} is not supported. Supported platforms: ${supportedPlatforms.join(', ')}`,
    };
  }
  
  if (!supportedArchs.includes(target.arch)) {
    return {
      valid: false,
      reason: `Architecture ${target.arch} is not supported. Supported architectures: ${supportedArchs.join(', ')}`,
    };
  }
  
  return { valid: true };
}
