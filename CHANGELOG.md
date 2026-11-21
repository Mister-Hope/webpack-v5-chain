## [2.2.0](https://github.com/Mister-Hope/webpack-v5-chain/compare/v2.1.0...v2.2.0) (2026-11-21)

### Features

- export public chain classes and harden toString ([#237](https://github.com/Mister-Hope/webpack-v5-chain/issues/237)) ([09b699b](https://github.com/Mister-Hope/webpack-v5-chain/commit/09b699b52795a868d3d7c00471288ae0c53233d8))
- support all webpack performance options ([#215](https://github.com/Mister-Hope/webpack-v5-chain/issues/215)) ([4571f2a](https://github.com/Mister-Hope/webpack-v5-chain/commit/4571f2ad5a64a032591c0e438d9f59391634fcda))

### Bug Fixes

- avoid stack overflow when merging cyclic values ([#240](https://github.com/Mister-Hope/webpack-v5-chain/issues/240)) ([a6f42ba](https://github.com/Mister-Hope/webpack-v5-chain/commit/a6f42ba6000d83197d173a174eede552cf2bfe3c))
- ESM plugins and instance reuse ([#222](https://github.com/Mister-Hope/webpack-v5-chain/issues/222)) ([a6d2621](https://github.com/Mister-Hope/webpack-v5-chain/commit/a6d26216689f2d384d20086ab96134ca481f0af1))
- expose missing webpack passthrough options ([#234](https://github.com/Mister-Hope/webpack-v5-chain/issues/234)) ([843f61d](https://github.com/Mister-Hope/webpack-v5-chain/commit/843f61d047ef8119d75e7a606ecdcc6ab840dfd3))
- harden extend and collection mutation ([#236](https://github.com/Mister-Hope/webpack-v5-chain/issues/236)) ([42715fe](https://github.com/Mister-Hope/webpack-v5-chain/commit/42715fe4bb9812fcde70a9167feb56732c3a7593))
- honor chained before/after ordering ([#225](https://github.com/Mister-Hope/webpack-v5-chain/issues/225)) ([1564a28](https://github.com/Mister-Hope/webpack-v5-chain/commit/1564a28cdacb758f0dde74bb12c52aa20a1cc335))
- isolate values returned by config serialization ([#235](https://github.com/Mister-Hope/webpack-v5-chain/issues/235)) ([ea7d555](https://github.com/Mister-Hope/webpack-v5-chain/commit/ea7d555f2022e9606045289cdedb9d10c21e8e23))
- keep callable this on proxy and add smoke tests ([#230](https://github.com/Mister-Hope/webpack-v5-chain/issues/230)) ([a487334](https://github.com/Mister-Hope/webpack-v5-chain/commit/a487334e7767fa7bdc611db4a3955e2fd1488d8a))
- keep explicitly emptied config values ([#227](https://github.com/Mister-Hope/webpack-v5-chain/issues/227)) ([11bbbec](https://github.com/Mister-Hope/webpack-v5-chain/commit/11bbbecc1a19d112ece9d445d2144a41b20c9c6b))
- keep insertion order for integer-like names ([#233](https://github.com/Mister-Hope/webpack-v5-chain/issues/233)) ([ad409f1](https://github.com/Mister-Hope/webpack-v5-chain/commit/ad409f1d23a80d857671220bf1e582aeae1a4a9a))
- keep splitChunks when merging options ([#223](https://github.com/Mister-Hope/webpack-v5-chain/issues/223)) ([81c88e4](https://github.com/Mister-Hope/webpack-v5-chain/commit/81c88e4a3ba332f24f15a62044b112fbac477a2d))
- keep string rule conditions as-is ([#221](https://github.com/Mister-Hope/webpack-v5-chain/issues/221)) ([ac91c0e](https://github.com/Mister-Hope/webpack-v5-chain/commit/ac91c0ea4e95b64f691ca0706af3b64f246f4906))
- make type dependencies explicit peers ([#224](https://github.com/Mister-Hope/webpack-v5-chain/issues/224)) ([1c1ea67](https://github.com/Mister-Hope/webpack-v5-chain/commit/1c1ea67f3c1fc3ec91d218ed39b17249672c804f))
- normalize single value in set merge ([#220](https://github.com/Mister-Hope/webpack-v5-chain/issues/220)) ([ae16158](https://github.com/Mister-Hope/webpack-v5-chain/commit/ae16158e993f51737f3e30ebca8b66f29e1d90e0))
- preserve generator and parser on merge ([#214](https://github.com/Mister-Hope/webpack-v5-chain/issues/214)) ([68a4dad](https://github.com/Mister-Hope/webpack-v5-chain/commit/68a4dadee3a84d2652d0d76ccded777d39abf892))
- preserve special values when merging configs ([#218](https://github.com/Mister-Hope/webpack-v5-chain/issues/218)) ([764b4d2](https://github.com/Mister-Hope/webpack-v5-chain/commit/764b4d24528325b258a4ba99770a71495ee15139))
- reject duplicate before/after constraints ([#238](https://github.com/Mister-Hope/webpack-v5-chain/issues/238)) ([3c1c4ab](https://github.com/Mister-Hope/webpack-v5-chain/commit/3c1c4ab625651a562c387a866a2bd868c22de899))
- reject relative plugin paths with a clear error ([#232](https://github.com/Mister-Hope/webpack-v5-chain/issues/232)) ([36b115b](https://github.com/Mister-Hope/webpack-v5-chain/commit/36b115b6fab49bb47e9b84747b4cf88851e36b51))
- remove resolveLoader legacy options ([#216](https://github.com/Mister-Hope/webpack-v5-chain/issues/216)) ([cf7c2f9](https://github.com/Mister-Hope/webpack-v5-chain/commit/cf7c2f9adbd7ed9514eb4d59d262c1dd0e7c032b))
- reset useMap when clearing a value map ([#231](https://github.com/Mister-Hope/webpack-v5-chain/issues/231)) ([aa38baa](https://github.com/Mister-Hope/webpack-v5-chain/commit/aa38baa6f8e54c4314a454c06af9b18c99875e01))
- support entry description objects ([#217](https://github.com/Mister-Hope/webpack-v5-chain/issues/217)) ([dd5182a](https://github.com/Mister-Hope/webpack-v5-chain/commit/dd5182a2026b9d625c4c713f305caf9447b90329)), references [#219](https://github.com/Mister-Hope/webpack-v5-chain/issues/219)
- type entries() as possibly undefined ([#239](https://github.com/Mister-Hope/webpack-v5-chain/issues/239)) ([5bcde25](https://github.com/Mister-Hope/webpack-v5-chain/commit/5bcde250c8fb2de9cb29193d5391aa4e0ce44d0f))

## [2.1.0](https://github.com/Mister-Hope/webpack-v5-chain/compare/v2.0.0...v2.1.0) (2026-09-25)

### Features

- sync latest webpack API and fix lint ([#189](https://github.com/Mister-Hope/webpack-v5-chain/issues/189)) ([1912e3e](https://github.com/Mister-Hope/webpack-v5-chain/commit/1912e3eb8d6ff4934805906229066a6723f54d7d))

## [2.0.0](https://github.com/Mister-Hope/webpack-v5-chain/compare/v1.1.0...v2.0.0) (2026-07-10)

### ⚠ BREAKING CHANGES

- drop node 18 and 20

### Features

- add missing options ([697f5ad](https://github.com/Mister-Hope/webpack-v5-chain/commit/697f5adab8473c1d609e79094b84eb3e393ef253))
- drop node 18 and 20 ([81f7b90](https://github.com/Mister-Hope/webpack-v5-chain/commit/81f7b90333f6968e383b60b9fd26ff565310c5b3))
- rebuild with ts ([1be2945](https://github.com/Mister-Hope/webpack-v5-chain/commit/1be29456c7b0925ee09432a4cffa1f50ac7d3b3c))

## [1.1.0](https://github.com/Mister-Hope/webpack-v5-chain/compare/v1.0.1...v1.1.0) (2025-12-02)

### Features

- add support for dotenv option ([8de1249](https://github.com/Mister-Hope/webpack-v5-chain/commit/8de1249b4422aa09fbb395e2ebf3c458de3e4680))

## [1.0.1](https://github.com/Mister-Hope/webpack-v5-chain/compare/v1.0.0...v1.0.1) (2025-10-14)

### Features

- add extractSourceMap tao Rules ([dd8a4a7](https://github.com/Mister-Hope/webpack-v5-chain/commit/dd8a4a7479ea731aa8fdef9e4e3d23ce587088cd))

## [1.0.0](https://github.com/Mister-Hope/webpack-v5-chain/compare/40ef9b887f7691755b1818ed24a434427577bc1b...v1.0.0) (2025-05-05)

### Features

- init package ([40ef9b8](https://github.com/Mister-Hope/webpack-v5-chain/commit/40ef9b887f7691755b1818ed24a434427577bc1b))
