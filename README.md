# @augment-code/pkg

> **PKG Revival** - Community-maintained successor to the archived vercel/pkg

Package your Node.js project into an executable that can run even on devices without Node.js installed.

[![CI](https://github.com/callmedayz/pkg/actions/workflows/ci.yml/badge.svg)](https://github.com/callmedayz/pkg/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@augment-code%2Fpkg.svg)](https://badge.fury.io/js/@augment-code%2Fpkg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 What's New in PKG Revival

- ✅ **Node.js 20.x & 21.x Support** - Latest Node.js versions with SEA integration
- ✅ **Single Executable Applications (SEA)** - Native Node.js 21+ SEA support for faster, smaller executables
- ✅ **Hybrid Build System** - Automatically chooses the best build method for your project
- ✅ **Enhanced Security** - All vulnerabilities fixed, modern dependencies
- ✅ **Improved Performance** - Up to 50% faster builds with SEA mode
- ✅ **Full Backward Compatibility** - Drop-in replacement for original pkg

## 📦 Installation

```bash
# Install globally
npm install -g @augment-code/pkg

# Or use with npx (no installation required)
npx @augment-code/pkg --help
```

## 🎯 Quick Start

```bash
# Package your app (auto-detects best method)
pkg index.js

# Use Node.js SEA for faster builds (Node.js 21+ only)
pkg --sea -t node21-linux index.js

# Force traditional PKG for full compatibility
pkg --traditional index.js

# Build for multiple platforms
pkg -t node20-linux,node20-macos,node20-win index.js
```

## 📖 Usage

After installing, run `pkg --help` to see all available options:

```
  pkg [options] <input>

  Options:

    -h, --help           output usage information
    -v, --version        output pkg version
    -t, --targets        comma-separated list of targets (see examples)
    -c, --config         package.json or any json file with top-level config
    --options            bake v8 options into executable to run with them on
    -o, --output         output file name or template for several files
    --out-path           path to save output one or more executables
    -d, --debug          show more information during packaging process [off]
    -b, --build          don't download prebuilt base binaries, build them
    --public             speed up and disclose the sources of top-level project
    --public-packages    force specified packages to be considered public
    --no-bytecode        skip bytecode generation and include source files as plain js
    --no-native-build    skip native addons build
    --no-dict            comma-separated list of packages names to ignore dictionaries
    -C, --compress       [default=None] compression algorithm = Brotli or GZip
    --sea                force Node.js SEA mode (faster, smaller, Node.js 21+ only)
    --traditional        force traditional PKG mode (full compatibility)
    --hybrid             auto-select best build method (default)
    --use-snapshot       enable SEA startup snapshot (Node.js 20+ only)
    --use-code-cache     enable SEA V8 code cache (default: true)

  Examples:

  – Makes executables for Linux, macOS and Windows
    $ pkg index.js
  – Takes package.json from cwd and follows 'bin' entry
    $ pkg .
  – Makes executable for particular target machine
    $ pkg -t node18-win-arm64 index.js
  – Makes executables for target machines of your choice
    $ pkg -t node20-linux,node21-linux,node21-win index.js
  – Use Node.js SEA for faster builds (Node.js 21+ only)
    $ pkg --sea -t node21-linux index.js
  – Auto-select best build method (hybrid mode)
    $ pkg --hybrid -t node20,node18 index.js
  – Force traditional PKG for full compatibility
    $ pkg --traditional index.js
  – Bakes '--expose-gc' and '--max-heap-size=34' into executable
    $ pkg --options "expose-gc,max-heap-size=34" index.js
  – Consider packageA and packageB to be public
    $ pkg --public-packages "packageA,packageB" index.js
  – reduce size of the data packed inside the executable with GZip
    $ pkg --compress GZip index.js
```

## 🎯 Use Cases

- Make a commercial version of your application without sources
- Make a demo/evaluation/trial version of your app without sources
- Instantly make executables for other platforms (cross-compilation)
- Make some kind of self-extracting archive or installer
- No need to install Node.js and npm to run the packaged application
- No need to download hundreds of files via `npm install` to deploy your application
- Put your assets inside the executable to make it even more portable
- Test your app against new Node.js version without installing it

## 🔄 Migration from Original PKG

This is a **drop-in replacement** for the original pkg. Simply replace your installation:

```bash
# Remove original pkg
npm uninstall -g pkg

# Install PKG revival
npm install -g @augment-code/pkg

# Your existing commands work unchanged
pkg index.js
```

### What's Different

- **Package name**: `@augment-code/pkg` instead of `pkg`
- **Enhanced features**: SEA support, better performance, modern Node.js versions
- **Same API**: All existing commands and options work exactly the same
- **Better security**: All vulnerabilities fixed, modern dependencies

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/callmedayz/pkg.git
cd pkg

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Test with your own project
node lib-es5/bin.js your-app.js
```

## 🤝 Contributing

We welcome contributions! This is a community-driven revival of the original PKG project.

- **Bug reports**: [GitHub Issues](https://github.com/callmedayz/pkg/issues)
- **Feature requests**: [GitHub Discussions](https://github.com/callmedayz/pkg/discussions)
- **Pull requests**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

This project is a community revival and is not affiliated with Vercel or the original PKG maintainers.

---

_Made with ❤️ by the Node.js community_
