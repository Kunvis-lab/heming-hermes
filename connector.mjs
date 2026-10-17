import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod2) => function __require2() {
  try {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  } catch (e) {
    throw mod2 = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// apps/mobile/node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod2(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// apps/mobile/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// apps/mobile/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "apps/mobile/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// apps/mobile/node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod2;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod2 = (bits >> i & 1) === 1;
        matrix.set(row, col, mod2, true);
        matrix.set(col, row, mod2, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod2;
      for (i = 0; i < 15; i++) {
        mod2 = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod2, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod2, true);
        } else {
          matrix.set(size - 15 + i, 8, mod2, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod2, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod2, true);
        } else {
          matrix.set(8, 15 - i - 1, mod2, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/chunkstream.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var ChunkStream = module.exports = function() {
      Stream.call(this);
      this._buffers = [];
      this._buffered = 0;
      this._reads = [];
      this._paused = false;
      this._encoding = "utf8";
      this.writable = true;
    };
    util.inherits(ChunkStream, Stream);
    ChunkStream.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
      process.nextTick(
        function() {
          this._process();
          if (this._paused && this._reads && this._reads.length > 0) {
            this._paused = false;
            this.emit("drain");
          }
        }.bind(this)
      );
    };
    ChunkStream.prototype.write = function(data, encoding) {
      if (!this.writable) {
        this.emit("error", new Error("Stream not writable"));
        return false;
      }
      let dataBuffer;
      if (Buffer.isBuffer(data)) {
        dataBuffer = data;
      } else {
        dataBuffer = Buffer.from(data, encoding || this._encoding);
      }
      this._buffers.push(dataBuffer);
      this._buffered += dataBuffer.length;
      this._process();
      if (this._reads && this._reads.length === 0) {
        this._paused = true;
      }
      return this.writable && !this._paused;
    };
    ChunkStream.prototype.end = function(data, encoding) {
      if (data) {
        this.write(data, encoding);
      }
      this.writable = false;
      if (!this._buffers) {
        return;
      }
      if (this._buffers.length === 0) {
        this._end();
      } else {
        this._buffers.push(null);
        this._process();
      }
    };
    ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
    ChunkStream.prototype._end = function() {
      if (this._reads.length > 0) {
        this.emit("error", new Error("Unexpected end of input"));
      }
      this.destroy();
    };
    ChunkStream.prototype.destroy = function() {
      if (!this._buffers) {
        return;
      }
      this.writable = false;
      this._reads = null;
      this._buffers = null;
      this.emit("close");
    };
    ChunkStream.prototype._processReadAllowingLess = function(read) {
      this._reads.shift();
      let smallerBuf = this._buffers[0];
      if (smallerBuf.length > read.length) {
        this._buffered -= read.length;
        this._buffers[0] = smallerBuf.slice(read.length);
        read.func.call(this, smallerBuf.slice(0, read.length));
      } else {
        this._buffered -= smallerBuf.length;
        this._buffers.shift();
        read.func.call(this, smallerBuf);
      }
    };
    ChunkStream.prototype._processRead = function(read) {
      this._reads.shift();
      let pos = 0;
      let count = 0;
      let data = Buffer.alloc(read.length);
      while (pos < read.length) {
        let buf = this._buffers[count++];
        let len = Math.min(buf.length, read.length - pos);
        buf.copy(data, pos, 0, len);
        pos += len;
        if (len !== buf.length) {
          this._buffers[--count] = buf.slice(len);
        }
      }
      if (count > 0) {
        this._buffers.splice(0, count);
      }
      this._buffered -= read.length;
      read.func.call(this, data);
    };
    ChunkStream.prototype._process = function() {
      try {
        while (this._buffered > 0 && this._reads && this._reads.length > 0) {
          let read = this._reads[0];
          if (read.allowLess) {
            this._processReadAllowingLess(read);
          } else if (this._buffered >= read.length) {
            this._processRead(read);
          } else {
            break;
          }
        }
        if (this._buffers && !this.writable) {
          this._end();
        }
      } catch (ex) {
        this.emit("error", ex);
      }
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/interlace.js"(exports) {
    "use strict";
    var imagePasses = [
      {
        // pass 1 - 1px
        x: [0],
        y: [0]
      },
      {
        // pass 2 - 1px
        x: [4],
        y: [0]
      },
      {
        // pass 3 - 2px
        x: [0, 4],
        y: [4]
      },
      {
        // pass 4 - 4px
        x: [2, 6],
        y: [0, 4]
      },
      {
        // pass 5 - 8px
        x: [0, 2, 4, 6],
        y: [2, 6]
      },
      {
        // pass 6 - 16px
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
      },
      {
        // pass 7 - 32px
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
      }
    ];
    exports.getImagePasses = function(width, height) {
      let images = [];
      let xLeftOver = width % 8;
      let yLeftOver = height % 8;
      let xRepeats = (width - xLeftOver) / 8;
      let yRepeats = (height - yLeftOver) / 8;
      for (let i = 0; i < imagePasses.length; i++) {
        let pass = imagePasses[i];
        let passWidth = xRepeats * pass.x.length;
        let passHeight = yRepeats * pass.y.length;
        for (let j = 0; j < pass.x.length; j++) {
          if (pass.x[j] < xLeftOver) {
            passWidth++;
          } else {
            break;
          }
        }
        for (let j = 0; j < pass.y.length; j++) {
          if (pass.y[j] < yLeftOver) {
            passHeight++;
          } else {
            break;
          }
        }
        if (passWidth > 0 && passHeight > 0) {
          images.push({ width: passWidth, height: passHeight, index: i });
        }
      }
      return images;
    };
    exports.getInterlaceIterator = function(width) {
      return function(x, y, pass) {
        let outerXLeftOver = x % imagePasses[pass].x.length;
        let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
        let outerYLeftOver = y % imagePasses[pass].y.length;
        let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
        return outerX * 4 + outerY * width * 4;
      };
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
    "use strict";
    module.exports = function paethPredictor(left, above, upLeft) {
      let paeth = left + above - upLeft;
      let pLeft = Math.abs(paeth - left);
      let pAbove = Math.abs(paeth - above);
      let pUpLeft = Math.abs(paeth - upLeft);
      if (pLeft <= pAbove && pLeft <= pUpLeft) {
        return left;
      }
      if (pAbove <= pUpLeft) {
        return above;
      }
      return upLeft;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/filter-parse.js"(exports, module) {
    "use strict";
    var interlaceUtils = require_interlace();
    var paethPredictor = require_paeth_predictor();
    function getByteWidth(width, bpp, depth) {
      let byteWidth = width * bpp;
      if (depth !== 8) {
        byteWidth = Math.ceil(byteWidth / (8 / depth));
      }
      return byteWidth;
    }
    var Filter = module.exports = function(bitmapInfo, dependencies) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let interlace = bitmapInfo.interlace;
      let bpp = bitmapInfo.bpp;
      let depth = bitmapInfo.depth;
      this.read = dependencies.read;
      this.write = dependencies.write;
      this.complete = dependencies.complete;
      this._imageIndex = 0;
      this._images = [];
      if (interlace) {
        let passes = interlaceUtils.getImagePasses(width, height);
        for (let i = 0; i < passes.length; i++) {
          this._images.push({
            byteWidth: getByteWidth(passes[i].width, bpp, depth),
            height: passes[i].height,
            lineIndex: 0
          });
        }
      } else {
        this._images.push({
          byteWidth: getByteWidth(width, bpp, depth),
          height,
          lineIndex: 0
        });
      }
      if (depth === 8) {
        this._xComparison = bpp;
      } else if (depth === 16) {
        this._xComparison = bpp * 2;
      } else {
        this._xComparison = 1;
      }
    };
    Filter.prototype.start = function() {
      this.read(
        this._images[this._imageIndex].byteWidth + 1,
        this._reverseFilterLine.bind(this)
      );
    };
    Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        unfilteredLine[x] = rawByte + f1Left;
      }
    };
    Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f2Up = lastLine ? lastLine[x] : 0;
        unfilteredLine[x] = rawByte + f2Up;
      }
    };
    Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f3Up = lastLine ? lastLine[x] : 0;
        let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f3Add = Math.floor((f3Left + f3Up) / 2);
        unfilteredLine[x] = rawByte + f3Add;
      }
    };
    Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f4Up = lastLine ? lastLine[x] : 0;
        let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
        let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
        unfilteredLine[x] = rawByte + f4Add;
      }
    };
    Filter.prototype._reverseFilterLine = function(rawData) {
      let filter = rawData[0];
      let unfilteredLine;
      let currentImage = this._images[this._imageIndex];
      let byteWidth = currentImage.byteWidth;
      if (filter === 0) {
        unfilteredLine = rawData.slice(1, byteWidth + 1);
      } else {
        unfilteredLine = Buffer.alloc(byteWidth);
        switch (filter) {
          case 1:
            this._unFilterType1(rawData, unfilteredLine, byteWidth);
            break;
          case 2:
            this._unFilterType2(rawData, unfilteredLine, byteWidth);
            break;
          case 3:
            this._unFilterType3(rawData, unfilteredLine, byteWidth);
            break;
          case 4:
            this._unFilterType4(rawData, unfilteredLine, byteWidth);
            break;
          default:
            throw new Error("Unrecognised filter type - " + filter);
        }
      }
      this.write(unfilteredLine);
      currentImage.lineIndex++;
      if (currentImage.lineIndex >= currentImage.height) {
        this._lastLine = null;
        this._imageIndex++;
        currentImage = this._images[this._imageIndex];
      } else {
        this._lastLine = unfilteredLine;
      }
      if (currentImage) {
        this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
      } else {
        this._lastLine = null;
        this.complete();
      }
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var ChunkStream = require_chunkstream();
    var Filter = require_filter_parse();
    var FilterAsync = module.exports = function(bitmapInfo) {
      ChunkStream.call(this);
      let buffers = [];
      let that = this;
      this._filter = new Filter(bitmapInfo, {
        read: this.read.bind(this),
        write: function(buffer) {
          buffers.push(buffer);
        },
        complete: function() {
          that.emit("complete", Buffer.concat(buffers));
        }
      });
      this._filter.start();
    };
    util.inherits(FilterAsync, ChunkStream);
  }
});

// apps/mobile/node_modules/pngjs/lib/constants.js
var require_constants = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
      TYPE_IHDR: 1229472850,
      TYPE_IEND: 1229278788,
      TYPE_IDAT: 1229209940,
      TYPE_PLTE: 1347179589,
      TYPE_tRNS: 1951551059,
      // eslint-disable-line camelcase
      TYPE_gAMA: 1732332865,
      // eslint-disable-line camelcase
      // color-type bits
      COLORTYPE_GRAYSCALE: 0,
      COLORTYPE_PALETTE: 1,
      COLORTYPE_COLOR: 2,
      COLORTYPE_ALPHA: 4,
      // e.g. grayscale and alpha
      // color-type combinations
      COLORTYPE_PALETTE_COLOR: 3,
      COLORTYPE_COLOR_ALPHA: 6,
      COLORTYPE_TO_BPP_MAP: {
        0: 1,
        2: 3,
        3: 1,
        4: 2,
        6: 4
      },
      GAMMA_DIVISION: 1e5
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/crc.js
var require_crc = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/crc.js"(exports, module) {
    "use strict";
    var crcTable = [];
    (function() {
      for (let i = 0; i < 256; i++) {
        let currentCrc = i;
        for (let j = 0; j < 8; j++) {
          if (currentCrc & 1) {
            currentCrc = 3988292384 ^ currentCrc >>> 1;
          } else {
            currentCrc = currentCrc >>> 1;
          }
        }
        crcTable[i] = currentCrc;
      }
    })();
    var CrcCalculator = module.exports = function() {
      this._crc = -1;
    };
    CrcCalculator.prototype.write = function(data) {
      for (let i = 0; i < data.length; i++) {
        this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
      }
      return true;
    };
    CrcCalculator.prototype.crc32 = function() {
      return this._crc ^ -1;
    };
    CrcCalculator.crc32 = function(buf) {
      let crc = -1;
      for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/parser.js
var require_parser = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/parser.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcCalculator = require_crc();
    var Parser = module.exports = function(options, dependencies) {
      this._options = options;
      options.checkCRC = options.checkCRC !== false;
      this._hasIHDR = false;
      this._hasIEND = false;
      this._emittedHeadersFinished = false;
      this._palette = [];
      this._colorType = 0;
      this._chunks = {};
      this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
      this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
      this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
      this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
      this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
      this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
      this.read = dependencies.read;
      this.error = dependencies.error;
      this.metadata = dependencies.metadata;
      this.gamma = dependencies.gamma;
      this.transColor = dependencies.transColor;
      this.palette = dependencies.palette;
      this.parsed = dependencies.parsed;
      this.inflateData = dependencies.inflateData;
      this.finished = dependencies.finished;
      this.simpleTransparency = dependencies.simpleTransparency;
      this.headersFinished = dependencies.headersFinished || function() {
      };
    };
    Parser.prototype.start = function() {
      this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
    };
    Parser.prototype._parseSignature = function(data) {
      let signature = constants.PNG_SIGNATURE;
      for (let i = 0; i < signature.length; i++) {
        if (data[i] !== signature[i]) {
          this.error(new Error("Invalid file signature"));
          return;
        }
      }
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._parseChunkBegin = function(data) {
      let length = data.readUInt32BE(0);
      let type = data.readUInt32BE(4);
      let name = "";
      for (let i = 4; i < 8; i++) {
        name += String.fromCharCode(data[i]);
      }
      let ancillary = Boolean(data[4] & 32);
      if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
        this.error(new Error("Expected IHDR on beggining"));
        return;
      }
      this._crc = new CrcCalculator();
      this._crc.write(Buffer.from(name));
      if (this._chunks[type]) {
        return this._chunks[type](length);
      }
      if (!ancillary) {
        this.error(new Error("Unsupported critical chunk type " + name));
        return;
      }
      this.read(length + 4, this._skipChunk.bind(this));
    };
    Parser.prototype._skipChunk = function() {
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._handleChunkEnd = function() {
      this.read(4, this._parseChunkEnd.bind(this));
    };
    Parser.prototype._parseChunkEnd = function(data) {
      let fileCrc = data.readInt32BE(0);
      let calcCrc = this._crc.crc32();
      if (this._options.checkCRC && calcCrc !== fileCrc) {
        this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
        return;
      }
      if (!this._hasIEND) {
        this.read(8, this._parseChunkBegin.bind(this));
      }
    };
    Parser.prototype._handleIHDR = function(length) {
      this.read(length, this._parseIHDR.bind(this));
    };
    Parser.prototype._parseIHDR = function(data) {
      this._crc.write(data);
      let width = data.readUInt32BE(0);
      let height = data.readUInt32BE(4);
      let depth = data[8];
      let colorType = data[9];
      let compr = data[10];
      let filter = data[11];
      let interlace = data[12];
      if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
        this.error(new Error("Unsupported bit depth " + depth));
        return;
      }
      if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
        this.error(new Error("Unsupported color type"));
        return;
      }
      if (compr !== 0) {
        this.error(new Error("Unsupported compression method"));
        return;
      }
      if (filter !== 0) {
        this.error(new Error("Unsupported filter method"));
        return;
      }
      if (interlace !== 0 && interlace !== 1) {
        this.error(new Error("Unsupported interlace method"));
        return;
      }
      this._colorType = colorType;
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
      this._hasIHDR = true;
      this.metadata({
        width,
        height,
        depth,
        interlace: Boolean(interlace),
        palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
        color: Boolean(colorType & constants.COLORTYPE_COLOR),
        alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
        bpp,
        colorType
      });
      this._handleChunkEnd();
    };
    Parser.prototype._handlePLTE = function(length) {
      this.read(length, this._parsePLTE.bind(this));
    };
    Parser.prototype._parsePLTE = function(data) {
      this._crc.write(data);
      let entries = Math.floor(data.length / 3);
      for (let i = 0; i < entries; i++) {
        this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
      }
      this.palette(this._palette);
      this._handleChunkEnd();
    };
    Parser.prototype._handleTRNS = function(length) {
      this.simpleTransparency();
      this.read(length, this._parseTRNS.bind(this));
    };
    Parser.prototype._parseTRNS = function(data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
        if (this._palette.length === 0) {
          this.error(new Error("Transparency chunk must be after palette"));
          return;
        }
        if (data.length > this._palette.length) {
          this.error(new Error("More transparent colors than palette size"));
          return;
        }
        for (let i = 0; i < data.length; i++) {
          this._palette[i][3] = data[i];
        }
        this.palette(this._palette);
      }
      if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
        this.transColor([data.readUInt16BE(0)]);
      }
      if (this._colorType === constants.COLORTYPE_COLOR) {
        this.transColor([
          data.readUInt16BE(0),
          data.readUInt16BE(2),
          data.readUInt16BE(4)
        ]);
      }
      this._handleChunkEnd();
    };
    Parser.prototype._handleGAMA = function(length) {
      this.read(length, this._parseGAMA.bind(this));
    };
    Parser.prototype._parseGAMA = function(data) {
      this._crc.write(data);
      this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
      this._handleChunkEnd();
    };
    Parser.prototype._handleIDAT = function(length) {
      if (!this._emittedHeadersFinished) {
        this._emittedHeadersFinished = true;
        this.headersFinished();
      }
      this.read(-length, this._parseIDAT.bind(this, length));
    };
    Parser.prototype._parseIDAT = function(length, data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
        throw new Error("Expected palette not found");
      }
      this.inflateData(data);
      let leftOverLength = length - data.length;
      if (leftOverLength > 0) {
        this._handleIDAT(leftOverLength);
      } else {
        this._handleChunkEnd();
      }
    };
    Parser.prototype._handleIEND = function(length) {
      this.read(length, this._parseIEND.bind(this));
    };
    Parser.prototype._parseIEND = function(data) {
      this._crc.write(data);
      this._hasIEND = true;
      this._handleChunkEnd();
      if (this.finished) {
        this.finished();
      }
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/bitmapper.js"(exports) {
    "use strict";
    var interlaceUtils = require_interlace();
    var pixelBppMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos === data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = 255;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 1 >= data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = data[rawPos + 1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 2 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = 255;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 3 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = data[rawPos + 3];
      }
    ];
    var pixelBppCustomMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = maxBit;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, pixelData, pxPos) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = pixelData[1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = maxBit;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, pixelData, pxPos) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = pixelData[3];
      }
    ];
    function bitRetriever(data, depth) {
      let leftOver = [];
      let i = 0;
      function split() {
        if (i === data.length) {
          throw new Error("Ran out of data");
        }
        let byte = data[i];
        i++;
        let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
        switch (depth) {
          default:
            throw new Error("unrecognised depth");
          case 16:
            byte2 = data[i];
            i++;
            leftOver.push((byte << 8) + byte2);
            break;
          case 4:
            byte2 = byte & 15;
            byte1 = byte >> 4;
            leftOver.push(byte1, byte2);
            break;
          case 2:
            byte4 = byte & 3;
            byte3 = byte >> 2 & 3;
            byte2 = byte >> 4 & 3;
            byte1 = byte >> 6 & 3;
            leftOver.push(byte1, byte2, byte3, byte4);
            break;
          case 1:
            byte8 = byte & 1;
            byte7 = byte >> 1 & 1;
            byte6 = byte >> 2 & 1;
            byte5 = byte >> 3 & 1;
            byte4 = byte >> 4 & 1;
            byte3 = byte >> 5 & 1;
            byte2 = byte >> 6 & 1;
            byte1 = byte >> 7 & 1;
            leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
            break;
        }
      }
      return {
        get: function(count) {
          while (leftOver.length < count) {
            split();
          }
          let returner = leftOver.slice(0, count);
          leftOver = leftOver.slice(count);
          return returner;
        },
        resetAfterLine: function() {
          leftOver.length = 0;
        },
        end: function() {
          if (i !== data.length) {
            throw new Error("extra data found");
          }
        }
      };
    }
    function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
          rawPos += bpp;
        }
      }
      return rawPos;
    }
    function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pixelData = bits.get(bpp);
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
        }
        bits.resetAfterLine();
      }
    }
    exports.dataToBitMap = function(data, bitmapInfo) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let depth = bitmapInfo.depth;
      let bpp = bitmapInfo.bpp;
      let interlace = bitmapInfo.interlace;
      let bits;
      if (depth !== 8) {
        bits = bitRetriever(data, depth);
      }
      let pxData;
      if (depth <= 8) {
        pxData = Buffer.alloc(width * height * 4);
      } else {
        pxData = new Uint16Array(width * height * 4);
      }
      let maxBit = Math.pow(2, depth) - 1;
      let rawPos = 0;
      let images;
      let getPxPos;
      if (interlace) {
        images = interlaceUtils.getImagePasses(width, height);
        getPxPos = interlaceUtils.getInterlaceIterator(width, height);
      } else {
        let nonInterlacedPxPos = 0;
        getPxPos = function() {
          let returner = nonInterlacedPxPos;
          nonInterlacedPxPos += 4;
          return returner;
        };
        images = [{ width, height }];
      }
      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        if (depth === 8) {
          rawPos = mapImage8Bit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            data,
            rawPos
          );
        } else {
          mapImageCustomBit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            bits,
            maxBit
          );
        }
      }
      if (depth === 8) {
        if (rawPos !== data.length) {
          throw new Error("extra data found");
        }
      } else {
        bits.end();
      }
      return pxData;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
    "use strict";
    function dePalette(indata, outdata, width, height, palette) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let color = palette[indata[pxPos]];
          if (!color) {
            throw new Error("index " + indata[pxPos] + " not in palette");
          }
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = color[i];
          }
          pxPos += 4;
        }
      }
    }
    function replaceTransparentColor(indata, outdata, width, height, transColor) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let makeTrans = false;
          if (transColor.length === 1) {
            if (transColor[0] === indata[pxPos]) {
              makeTrans = true;
            }
          } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
            makeTrans = true;
          }
          if (makeTrans) {
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = 0;
            }
          }
          pxPos += 4;
        }
      }
    }
    function scaleDepth(indata, outdata, width, height, depth) {
      let maxOutSample = 255;
      let maxInSample = Math.pow(2, depth) - 1;
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = Math.floor(
              indata[pxPos + i] * maxOutSample / maxInSample + 0.5
            );
          }
          pxPos += 4;
        }
      }
    }
    module.exports = function(indata, imageData) {
      let depth = imageData.depth;
      let width = imageData.width;
      let height = imageData.height;
      let colorType = imageData.colorType;
      let transColor = imageData.transColor;
      let palette = imageData.palette;
      let outdata = indata;
      if (colorType === 3) {
        dePalette(indata, outdata, width, height, palette);
      } else {
        if (transColor) {
          replaceTransparentColor(indata, outdata, width, height, transColor);
        }
        if (depth !== 8) {
          if (depth === 16) {
            outdata = Buffer.alloc(width * height * 4);
          }
          scaleDepth(indata, outdata, width, height, depth);
        }
      }
      return outdata;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/parser-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var zlib = __require("zlib");
    var ChunkStream = require_chunkstream();
    var FilterAsync = require_filter_parse_async();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    var ParserAsync = module.exports = function(options) {
      ChunkStream.call(this);
      this._parser = new Parser(options, {
        read: this.read.bind(this),
        error: this._handleError.bind(this),
        metadata: this._handleMetaData.bind(this),
        gamma: this.emit.bind(this, "gamma"),
        palette: this._handlePalette.bind(this),
        transColor: this._handleTransColor.bind(this),
        finished: this._finished.bind(this),
        inflateData: this._inflateData.bind(this),
        simpleTransparency: this._simpleTransparency.bind(this),
        headersFinished: this._headersFinished.bind(this)
      });
      this._options = options;
      this.writable = true;
      this._parser.start();
    };
    util.inherits(ParserAsync, ChunkStream);
    ParserAsync.prototype._handleError = function(err) {
      this.emit("error", err);
      this.writable = false;
      this.destroy();
      if (this._inflate && this._inflate.destroy) {
        this._inflate.destroy();
      }
      if (this._filter) {
        this._filter.destroy();
        this._filter.on("error", function() {
        });
      }
      this.errord = true;
    };
    ParserAsync.prototype._inflateData = function(data) {
      if (!this._inflate) {
        if (this._bitmapInfo.interlace) {
          this._inflate = zlib.createInflate();
          this._inflate.on("error", this.emit.bind(this, "error"));
          this._filter.on("complete", this._complete.bind(this));
          this._inflate.pipe(this._filter);
        } else {
          let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
          let imageSize = rowSize * this._bitmapInfo.height;
          let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
          this._inflate = zlib.createInflate({ chunkSize });
          let leftToInflate = imageSize;
          let emitError = this.emit.bind(this, "error");
          this._inflate.on("error", function(err) {
            if (!leftToInflate) {
              return;
            }
            emitError(err);
          });
          this._filter.on("complete", this._complete.bind(this));
          let filterWrite = this._filter.write.bind(this._filter);
          this._inflate.on("data", function(chunk) {
            if (!leftToInflate) {
              return;
            }
            if (chunk.length > leftToInflate) {
              chunk = chunk.slice(0, leftToInflate);
            }
            leftToInflate -= chunk.length;
            filterWrite(chunk);
          });
          this._inflate.on("end", this._filter.end.bind(this._filter));
        }
      }
      this._inflate.write(data);
    };
    ParserAsync.prototype._handleMetaData = function(metaData) {
      this._metaData = metaData;
      this._bitmapInfo = Object.create(metaData);
      this._filter = new FilterAsync(this._bitmapInfo);
    };
    ParserAsync.prototype._handleTransColor = function(transColor) {
      this._bitmapInfo.transColor = transColor;
    };
    ParserAsync.prototype._handlePalette = function(palette) {
      this._bitmapInfo.palette = palette;
    };
    ParserAsync.prototype._simpleTransparency = function() {
      this._metaData.alpha = true;
    };
    ParserAsync.prototype._headersFinished = function() {
      this.emit("metadata", this._metaData);
    };
    ParserAsync.prototype._finished = function() {
      if (this.errord) {
        return;
      }
      if (!this._inflate) {
        this.emit("error", "No Inflate block");
      } else {
        this._inflate.end();
      }
    };
    ParserAsync.prototype._complete = function(filteredData) {
      if (this.errord) {
        return;
      }
      let normalisedBitmapData;
      try {
        let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
        normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo);
        bitmapData = null;
      } catch (ex) {
        this._handleError(ex);
        return;
      }
      this.emit("parsed", normalisedBitmapData);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/bitpacker.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    module.exports = function(dataIn, width, height, options) {
      let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
        options.colorType
      ) !== -1;
      if (options.colorType === options.inputColorType) {
        let bigEndian = (function() {
          let buffer = new ArrayBuffer(2);
          new DataView(buffer).setInt16(
            0,
            256,
            true
            /* littleEndian */
          );
          return new Int16Array(buffer)[0] !== 256;
        })();
        if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
          return dataIn;
        }
      }
      let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
      let maxValue = 255;
      let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
      if (inBpp === 4 && !options.inputHasAlpha) {
        inBpp = 3;
      }
      let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
      if (options.bitDepth === 16) {
        maxValue = 65535;
        outBpp *= 2;
      }
      let outData = Buffer.alloc(width * height * outBpp);
      let inIndex = 0;
      let outIndex = 0;
      let bgColor = options.bgColor || {};
      if (bgColor.red === void 0) {
        bgColor.red = maxValue;
      }
      if (bgColor.green === void 0) {
        bgColor.green = maxValue;
      }
      if (bgColor.blue === void 0) {
        bgColor.blue = maxValue;
      }
      function getRGBA() {
        let red;
        let green;
        let blue;
        let alpha = maxValue;
        switch (options.inputColorType) {
          case constants.COLORTYPE_COLOR_ALPHA:
            alpha = data[inIndex + 3];
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_COLOR:
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_ALPHA:
            alpha = data[inIndex + 1];
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          case constants.COLORTYPE_GRAYSCALE:
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          default:
            throw new Error(
              "input color type:" + options.inputColorType + " is not supported at present"
            );
        }
        if (options.inputHasAlpha) {
          if (!outHasAlpha) {
            alpha /= maxValue;
            red = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
              maxValue
            );
            green = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
              maxValue
            );
            blue = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
              maxValue
            );
          }
        }
        return { red, green, blue, alpha };
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let rgba = getRGBA(data, inIndex);
          switch (options.colorType) {
            case constants.COLORTYPE_COLOR_ALPHA:
            case constants.COLORTYPE_COLOR:
              if (options.bitDepth === 8) {
                outData[outIndex] = rgba.red;
                outData[outIndex + 1] = rgba.green;
                outData[outIndex + 2] = rgba.blue;
                if (outHasAlpha) {
                  outData[outIndex + 3] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(rgba.red, outIndex);
                outData.writeUInt16BE(rgba.green, outIndex + 2);
                outData.writeUInt16BE(rgba.blue, outIndex + 4);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 6);
                }
              }
              break;
            case constants.COLORTYPE_ALPHA:
            case constants.COLORTYPE_GRAYSCALE: {
              let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
              if (options.bitDepth === 8) {
                outData[outIndex] = grayscale;
                if (outHasAlpha) {
                  outData[outIndex + 1] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(grayscale, outIndex);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 2);
                }
              }
              break;
            }
            default:
              throw new Error("unrecognised color Type " + options.colorType);
          }
          inIndex += inBpp;
          outIndex += outBpp;
        }
      }
      return outData;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/filter-pack.js"(exports, module) {
    "use strict";
    var paethPredictor = require_paeth_predictor();
    function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        rawData[rawPos + x] = pxData[pxPos + x];
      }
    }
    function filterSumNone(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let i = pxPos; i < length; i++) {
        sum += Math.abs(pxData[i]);
      }
      return sum;
    }
    function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumSub(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - up;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumUp(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let x = pxPos; x < length; x++) {
        let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
        let val = pxData[x] - up;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        sum += Math.abs(val);
      }
      return sum;
    }
    var filters = {
      0: filterNone,
      1: filterSub,
      2: filterUp,
      3: filterAvg,
      4: filterPaeth
    };
    var filterSums = {
      0: filterSumNone,
      1: filterSumSub,
      2: filterSumUp,
      3: filterSumAvg,
      4: filterSumPaeth
    };
    module.exports = function(pxData, width, height, options, bpp) {
      let filterTypes;
      if (!("filterType" in options) || options.filterType === -1) {
        filterTypes = [0, 1, 2, 3, 4];
      } else if (typeof options.filterType === "number") {
        filterTypes = [options.filterType];
      } else {
        throw new Error("unrecognised filter types");
      }
      if (options.bitDepth === 16) {
        bpp *= 2;
      }
      let byteWidth = width * bpp;
      let rawPos = 0;
      let pxPos = 0;
      let rawData = Buffer.alloc((byteWidth + 1) * height);
      let sel = filterTypes[0];
      for (let y = 0; y < height; y++) {
        if (filterTypes.length > 1) {
          let min = Infinity;
          for (let i = 0; i < filterTypes.length; i++) {
            let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
            if (sum < min) {
              sel = filterTypes[i];
              min = sum;
            }
          }
        }
        rawData[rawPos] = sel;
        rawPos++;
        filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
        rawPos += byteWidth;
        pxPos += byteWidth;
      }
      return rawData;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/packer.js
var require_packer = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/packer.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcStream = require_crc();
    var bitPacker = require_bitpacker();
    var filter = require_filter_pack();
    var zlib = __require("zlib");
    var Packer = module.exports = function(options) {
      this._options = options;
      options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
      options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
      options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
      options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
      options.deflateFactory = options.deflateFactory || zlib.createDeflate;
      options.bitDepth = options.bitDepth || 8;
      options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
      options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.colorType) === -1) {
        throw new Error(
          "option color type:" + options.colorType + " is not supported at present"
        );
      }
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.inputColorType) === -1) {
        throw new Error(
          "option input color type:" + options.inputColorType + " is not supported at present"
        );
      }
      if (options.bitDepth !== 8 && options.bitDepth !== 16) {
        throw new Error(
          "option bit depth:" + options.bitDepth + " is not supported at present"
        );
      }
    };
    Packer.prototype.getDeflateOptions = function() {
      return {
        chunkSize: this._options.deflateChunkSize,
        level: this._options.deflateLevel,
        strategy: this._options.deflateStrategy
      };
    };
    Packer.prototype.createDeflate = function() {
      return this._options.deflateFactory(this.getDeflateOptions());
    };
    Packer.prototype.filterData = function(data, width, height) {
      let packedData = bitPacker(data, width, height, this._options);
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
      let filteredData = filter(packedData, width, height, this._options, bpp);
      return filteredData;
    };
    Packer.prototype._packChunk = function(type, data) {
      let len = data ? data.length : 0;
      let buf = Buffer.alloc(len + 12);
      buf.writeUInt32BE(len, 0);
      buf.writeUInt32BE(type, 4);
      if (data) {
        data.copy(buf, 8);
      }
      buf.writeInt32BE(
        CrcStream.crc32(buf.slice(4, buf.length - 4)),
        buf.length - 4
      );
      return buf;
    };
    Packer.prototype.packGAMA = function(gamma) {
      let buf = Buffer.alloc(4);
      buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
      return this._packChunk(constants.TYPE_gAMA, buf);
    };
    Packer.prototype.packIHDR = function(width, height) {
      let buf = Buffer.alloc(13);
      buf.writeUInt32BE(width, 0);
      buf.writeUInt32BE(height, 4);
      buf[8] = this._options.bitDepth;
      buf[9] = this._options.colorType;
      buf[10] = 0;
      buf[11] = 0;
      buf[12] = 0;
      return this._packChunk(constants.TYPE_IHDR, buf);
    };
    Packer.prototype.packIDAT = function(data) {
      return this._packChunk(constants.TYPE_IDAT, data);
    };
    Packer.prototype.packIEND = function() {
      return this._packChunk(constants.TYPE_IEND, null);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/packer-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var constants = require_constants();
    var Packer = require_packer();
    var PackerAsync = module.exports = function(opt) {
      Stream.call(this);
      let options = opt || {};
      this._packer = new Packer(options);
      this._deflate = this._packer.createDeflate();
      this.readable = true;
    };
    util.inherits(PackerAsync, Stream);
    PackerAsync.prototype.pack = function(data, width, height, gamma) {
      this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
      this.emit("data", this._packer.packIHDR(width, height));
      if (gamma) {
        this.emit("data", this._packer.packGAMA(gamma));
      }
      let filteredData = this._packer.filterData(data, width, height);
      this._deflate.on("error", this.emit.bind(this, "error"));
      this._deflate.on(
        "data",
        function(compressedData) {
          this.emit("data", this._packer.packIDAT(compressedData));
        }.bind(this)
      );
      this._deflate.on(
        "end",
        function() {
          this.emit("data", this._packer.packIEND());
          this.emit("end");
        }.bind(this)
      );
      this._deflate.end(filteredData);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
    "use strict";
    var assert = __require("assert").ok;
    var zlib = __require("zlib");
    var util = __require("util");
    var kMaxLength = __require("buffer").kMaxLength;
    function Inflate(opts) {
      if (!(this instanceof Inflate)) {
        return new Inflate(opts);
      }
      if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
        opts.chunkSize = zlib.Z_MIN_CHUNK;
      }
      zlib.Inflate.call(this, opts);
      this._offset = this._offset === void 0 ? this._outOffset : this._offset;
      this._buffer = this._buffer || this._outBuffer;
      if (opts && opts.maxLength != null) {
        this._maxLength = opts.maxLength;
      }
    }
    function createInflate(opts) {
      return new Inflate(opts);
    }
    function _close(engine, callback) {
      if (callback) {
        process.nextTick(callback);
      }
      if (!engine._handle) {
        return;
      }
      engine._handle.close();
      engine._handle = null;
    }
    Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
      if (typeof asyncCb === "function") {
        return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
      }
      let self = this;
      let availInBefore = chunk && chunk.length;
      let availOutBefore = this._chunkSize - this._offset;
      let leftToInflate = this._maxLength;
      let inOff = 0;
      let buffers = [];
      let nread = 0;
      let error;
      this.on("error", function(err) {
        error = err;
      });
      function handleChunk(availInAfter, availOutAfter) {
        if (self._hadError) {
          return;
        }
        let have = availOutBefore - availOutAfter;
        assert(have >= 0, "have should not go down");
        if (have > 0) {
          let out = self._buffer.slice(self._offset, self._offset + have);
          self._offset += have;
          if (out.length > leftToInflate) {
            out = out.slice(0, leftToInflate);
          }
          buffers.push(out);
          nread += out.length;
          leftToInflate -= out.length;
          if (leftToInflate === 0) {
            return false;
          }
        }
        if (availOutAfter === 0 || self._offset >= self._chunkSize) {
          availOutBefore = self._chunkSize;
          self._offset = 0;
          self._buffer = Buffer.allocUnsafe(self._chunkSize);
        }
        if (availOutAfter === 0) {
          inOff += availInBefore - availInAfter;
          availInBefore = availInAfter;
          return true;
        }
        return false;
      }
      assert(this._handle, "zlib binding closed");
      let res;
      do {
        res = this._handle.writeSync(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        res = res || this._writeState;
      } while (!this._hadError && handleChunk(res[0], res[1]));
      if (this._hadError) {
        throw error;
      }
      if (nread >= kMaxLength) {
        _close(this);
        throw new RangeError(
          "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
        );
      }
      let buf = Buffer.concat(buffers, nread);
      _close(this);
      return buf;
    };
    util.inherits(Inflate, zlib.Inflate);
    function zlibBufferSync(engine, buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
      }
      if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
      }
      let flushFlag = engine._finishFlushFlag;
      if (flushFlag == null) {
        flushFlag = zlib.Z_FINISH;
      }
      return engine._processChunk(buffer, flushFlag);
    }
    function inflateSync(buffer, opts) {
      return zlibBufferSync(new Inflate(opts), buffer);
    }
    module.exports = exports = inflateSync;
    exports.Inflate = Inflate;
    exports.createInflate = createInflate;
    exports.inflateSync = inflateSync;
  }
});

// apps/mobile/node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/sync-reader.js"(exports, module) {
    "use strict";
    var SyncReader = module.exports = function(buffer) {
      this._buffer = buffer;
      this._reads = [];
    };
    SyncReader.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
    };
    SyncReader.prototype.process = function() {
      while (this._reads.length > 0 && this._buffer.length) {
        let read = this._reads[0];
        if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
          this._reads.shift();
          let buf = this._buffer;
          this._buffer = buf.slice(read.length);
          read.func.call(this, buf.slice(0, read.length));
        } else {
          break;
        }
      }
      if (this._reads.length > 0) {
        return new Error("There are some read requests waitng on finished stream");
      }
      if (this._buffer.length > 0) {
        return new Error("unrecognised content at end of stream");
      }
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
    "use strict";
    var SyncReader = require_sync_reader();
    var Filter = require_filter_parse();
    exports.process = function(inBuffer, bitmapInfo) {
      let outBuffers = [];
      let reader = new SyncReader(inBuffer);
      let filter = new Filter(bitmapInfo, {
        read: reader.read.bind(reader),
        write: function(bufferPart) {
          outBuffers.push(bufferPart);
        },
        complete: function() {
        }
      });
      filter.start();
      reader.process();
      return Buffer.concat(outBuffers);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/parser-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    var inflateSync = require_sync_inflate();
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var SyncReader = require_sync_reader();
    var FilterSync = require_filter_parse_sync();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    module.exports = function(buffer, options) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let err;
      function handleError(_err_) {
        err = _err_;
      }
      let metaData;
      function handleMetaData(_metaData_) {
        metaData = _metaData_;
      }
      function handleTransColor(transColor) {
        metaData.transColor = transColor;
      }
      function handlePalette(palette) {
        metaData.palette = palette;
      }
      function handleSimpleTransparency() {
        metaData.alpha = true;
      }
      let gamma;
      function handleGamma(_gamma_) {
        gamma = _gamma_;
      }
      let inflateDataList = [];
      function handleInflateData(inflatedData2) {
        inflateDataList.push(inflatedData2);
      }
      let reader = new SyncReader(buffer);
      let parser = new Parser(options, {
        read: reader.read.bind(reader),
        error: handleError,
        metadata: handleMetaData,
        gamma: handleGamma,
        palette: handlePalette,
        transColor: handleTransColor,
        inflateData: handleInflateData,
        simpleTransparency: handleSimpleTransparency
      });
      parser.start();
      reader.process();
      if (err) {
        throw err;
      }
      let inflateData = Buffer.concat(inflateDataList);
      inflateDataList.length = 0;
      let inflatedData;
      if (metaData.interlace) {
        inflatedData = zlib.inflateSync(inflateData);
      } else {
        let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
        let imageSize = rowSize * metaData.height;
        inflatedData = inflateSync(inflateData, {
          chunkSize: imageSize,
          maxLength: imageSize
        });
      }
      inflateData = null;
      if (!inflatedData || !inflatedData.length) {
        throw new Error("bad png - invalid inflate data response");
      }
      let unfilteredData = FilterSync.process(inflatedData, metaData);
      inflateData = null;
      let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
      unfilteredData = null;
      let normalisedBitmapData = formatNormaliser(bitmapData, metaData);
      metaData.data = normalisedBitmapData;
      metaData.gamma = gamma || 0;
      return metaData;
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/packer-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var constants = require_constants();
    var Packer = require_packer();
    module.exports = function(metaData, opt) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let options = opt || {};
      let packer = new Packer(options);
      let chunks = [];
      chunks.push(Buffer.from(constants.PNG_SIGNATURE));
      chunks.push(packer.packIHDR(metaData.width, metaData.height));
      if (metaData.gamma) {
        chunks.push(packer.packGAMA(metaData.gamma));
      }
      let filteredData = packer.filterData(
        metaData.data,
        metaData.width,
        metaData.height
      );
      let compressedData = zlib.deflateSync(
        filteredData,
        packer.getDeflateOptions()
      );
      filteredData = null;
      if (!compressedData || !compressedData.length) {
        throw new Error("bad png - invalid compressed data response");
      }
      chunks.push(packer.packIDAT(compressedData));
      chunks.push(packer.packIEND());
      return Buffer.concat(chunks);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/png-sync.js"(exports) {
    "use strict";
    var parse = require_parser_sync();
    var pack = require_packer_sync();
    exports.read = function(buffer, options) {
      return parse(buffer, options || {});
    };
    exports.write = function(png, options) {
      return pack(png, options);
    };
  }
});

// apps/mobile/node_modules/pngjs/lib/png.js
var require_png = __commonJS({
  "apps/mobile/node_modules/pngjs/lib/png.js"(exports) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var Parser = require_parser_async();
    var Packer = require_packer_async();
    var PNGSync = require_png_sync();
    var PNG = exports.PNG = function(options) {
      Stream.call(this);
      options = options || {};
      this.width = options.width | 0;
      this.height = options.height | 0;
      this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
      if (options.fill && this.data) {
        this.data.fill(0);
      }
      this.gamma = 0;
      this.readable = this.writable = true;
      this._parser = new Parser(options);
      this._parser.on("error", this.emit.bind(this, "error"));
      this._parser.on("close", this._handleClose.bind(this));
      this._parser.on("metadata", this._metadata.bind(this));
      this._parser.on("gamma", this._gamma.bind(this));
      this._parser.on(
        "parsed",
        function(data) {
          this.data = data;
          this.emit("parsed", data);
        }.bind(this)
      );
      this._packer = new Packer(options);
      this._packer.on("data", this.emit.bind(this, "data"));
      this._packer.on("end", this.emit.bind(this, "end"));
      this._parser.on("close", this._handleClose.bind(this));
      this._packer.on("error", this.emit.bind(this, "error"));
    };
    util.inherits(PNG, Stream);
    PNG.sync = PNGSync;
    PNG.prototype.pack = function() {
      if (!this.data || !this.data.length) {
        this.emit("error", "No data provided");
        return this;
      }
      process.nextTick(
        function() {
          this._packer.pack(this.data, this.width, this.height, this.gamma);
        }.bind(this)
      );
      return this;
    };
    PNG.prototype.parse = function(data, callback) {
      if (callback) {
        let onParsed, onError;
        onParsed = function(parsedData) {
          this.removeListener("error", onError);
          this.data = parsedData;
          callback(null, this);
        }.bind(this);
        onError = function(err) {
          this.removeListener("parsed", onParsed);
          callback(err, null);
        }.bind(this);
        this.once("parsed", onParsed);
        this.once("error", onError);
      }
      this.end(data);
      return this;
    };
    PNG.prototype.write = function(data) {
      this._parser.write(data);
      return true;
    };
    PNG.prototype.end = function(data) {
      this._parser.end(data);
    };
    PNG.prototype._metadata = function(metadata) {
      this.width = metadata.width;
      this.height = metadata.height;
      this.emit("metadata", metadata);
    };
    PNG.prototype._gamma = function(gamma) {
      this.gamma = gamma;
    };
    PNG.prototype._handleClose = function() {
      if (!this._parser.writable && !this._packer.readable) {
        this.emit("close");
      }
    };
    PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
      srcX |= 0;
      srcY |= 0;
      width |= 0;
      height |= 0;
      deltaX |= 0;
      deltaY |= 0;
      if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
        throw new Error("bitblt reading outside image");
      }
      if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
        throw new Error("bitblt writing outside image");
      }
      for (let y = 0; y < height; y++) {
        src.data.copy(
          dst.data,
          (deltaY + y) * dst.width + deltaX << 2,
          (srcY + y) * src.width + srcX << 2,
          (srcY + y) * src.width + srcX + width << 2
        );
      }
    };
    PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
      PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
      return this;
    };
    PNG.adjustGamma = function(src) {
      if (src.gamma) {
        for (let y = 0; y < src.height; y++) {
          for (let x = 0; x < src.width; x++) {
            let idx = src.width * y + x << 2;
            for (let i = 0; i < 3; i++) {
              let sample = src.data[idx + i] / 255;
              sample = Math.pow(sample, 1 / 2.2 / src.gamma);
              src.data[idx + i] = Math.round(sample * 255);
            }
          }
        }
        src.gamma = 0;
      }
    };
    PNG.prototype.adjustGamma = function() {
      PNG.adjustGamma(this);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/png.js
var require_png2 = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/png.js"(exports) {
    var fs = __require("fs");
    var PNG = require_png().PNG;
    var Utils = require_utils2();
    exports.render = function render(qrData, options) {
      const opts = Utils.getOptions(options);
      const pngOpts = opts.rendererOpts;
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      pngOpts.width = size;
      pngOpts.height = size;
      const pngImage = new PNG(pngOpts);
      Utils.qrToImageData(pngImage.data, qrData, opts);
      return pngImage;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      exports.renderToBuffer(qrData, options, function(err, output) {
        if (err) cb(err);
        let url = "data:image/png;base64,";
        url += output.toString("base64");
        cb(null, url);
      });
    };
    exports.renderToBuffer = function renderToBuffer(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const png = exports.render(qrData, options);
      const buffer = [];
      png.on("error", cb);
      png.on("data", function(data) {
        buffer.push(data);
      });
      png.on("end", function() {
        cb(null, Buffer.concat(buffer));
      });
      png.pack();
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      let called = false;
      const done = (...args2) => {
        if (called) return;
        called = true;
        cb.apply(null, args2);
      };
      const stream = fs.createWriteStream(path);
      stream.on("error", done);
      stream.on("close", done);
      exports.renderToFileStream(stream, qrData, options);
    };
    exports.renderToFileStream = function renderToFileStream(stream, qrData, options) {
      const png = exports.render(qrData, options);
      png.pack().pipe(stream);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/utf8.js
var require_utf8 = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/utf8.js"(exports) {
    var Utils = require_utils2();
    var BLOCK_CHAR = {
      WW: " ",
      WB: "\u2584",
      BB: "\u2588",
      BW: "\u2580"
    };
    var INVERTED_BLOCK_CHAR = {
      BB: " ",
      BW: "\u2584",
      WW: "\u2588",
      WB: "\u2580"
    };
    function getBlockChar(top, bottom, blocks) {
      if (top && bottom) return blocks.BB;
      if (top && !bottom) return blocks.BW;
      if (!top && bottom) return blocks.WB;
      return blocks.WW;
    }
    exports.render = function(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      let blocks = BLOCK_CHAR;
      if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000") {
        blocks = INVERTED_BLOCK_CHAR;
      }
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      let output = "";
      let hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
      hMargin = Array(opts.margin / 2 + 1).join(hMargin + "\n");
      const vMargin = Array(opts.margin + 1).join(blocks.WW);
      output += hMargin;
      for (let i = 0; i < size; i += 2) {
        output += vMargin;
        for (let j = 0; j < size; j++) {
          const topModule = data[i * size + j];
          const bottomModule = data[(i + 1) * size + j];
          output += getBlockChar(topModule, bottomModule, blocks);
        }
        output += vMargin + "\n";
      }
      output += hMargin.slice(0, -1);
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const utf8 = exports.render(qrData, options);
      fs.writeFile(path, utf8, cb);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/terminal/terminal.js
var require_terminal = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/terminal/terminal.js"(exports) {
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const black = "\x1B[40m  \x1B[0m";
      const white = "\x1B[47m  \x1B[0m";
      let output = "";
      const hMargin = Array(size + 3).join(white);
      const vMargin = Array(2).join(white);
      output += hMargin + "\n";
      for (let i = 0; i < size; ++i) {
        output += white;
        for (let j = 0; j < size; j++) {
          output += data[i * size + j] ? black : white;
        }
        output += vMargin + "\n";
      }
      output += hMargin + "\n";
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/terminal/terminal-small.js
var require_terminal_small = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/terminal/terminal-small.js"(exports) {
    var backgroundWhite = "\x1B[47m";
    var backgroundBlack = "\x1B[40m";
    var foregroundWhite = "\x1B[37m";
    var foregroundBlack = "\x1B[30m";
    var reset = "\x1B[0m";
    var lineSetupNormal = backgroundWhite + foregroundBlack;
    var lineSetupInverse = backgroundBlack + foregroundWhite;
    var createPalette = function(lineSetup, foregroundWhite2, foregroundBlack2) {
      return {
        // 1 ... white, 2 ... black, 0 ... transparent (default)
        "00": reset + " " + lineSetup,
        "01": reset + foregroundWhite2 + "\u2584" + lineSetup,
        "02": reset + foregroundBlack2 + "\u2584" + lineSetup,
        10: reset + foregroundWhite2 + "\u2580" + lineSetup,
        11: " ",
        12: "\u2584",
        20: reset + foregroundBlack2 + "\u2580" + lineSetup,
        21: "\u2580",
        22: "\u2588"
      };
    };
    var mkCodePixel = function(modules, size, x, y) {
      const sizePlus = size + 1;
      if (x >= sizePlus || y >= sizePlus || y < -1 || x < -1) return "0";
      if (x >= size || y >= size || y < 0 || x < 0) return "1";
      const idx = y * size + x;
      return modules[idx] ? "2" : "1";
    };
    var mkCode = function(modules, size, x, y) {
      return mkCodePixel(modules, size, x, y) + mkCodePixel(modules, size, x, y + 1);
    };
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const inverse = !!(options && options.inverse);
      const lineSetup = options && options.inverse ? lineSetupInverse : lineSetupNormal;
      const white = inverse ? foregroundBlack : foregroundWhite;
      const black = inverse ? foregroundWhite : foregroundBlack;
      const palette = createPalette(lineSetup, white, black);
      const newLine = reset + "\n" + lineSetup;
      let output = lineSetup;
      for (let y = -1; y < size + 1; y += 2) {
        for (let x = -1; x < size; x++) {
          output += palette[mkCode(data, size, x, y)];
        }
        output += palette[mkCode(data, size, size, y)] + newLine;
      }
      output += reset;
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/terminal.js
var require_terminal2 = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/terminal.js"(exports) {
    var big = require_terminal();
    var small = require_terminal_small();
    exports.render = function(qrData, options, cb) {
      if (options && options.small) {
        return small.render(qrData, options, cb);
      }
      return big.render(qrData, options, cb);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/svg.js
var require_svg = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/svg.js"(exports) {
    var svgTagRenderer = require_svg_tag();
    exports.render = svgTagRenderer.render;
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const svgTag = exports.render(qrData, options);
      const xmlStr = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + svgTag;
      fs.writeFile(path, xmlStr, cb);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args2 = [].slice.call(arguments, 1);
      const argsNum = args2.length;
      const isLastArgCb = typeof args2[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve3, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve3(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// apps/mobile/node_modules/qrcode/lib/server.js
var require_server = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/server.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var PngRenderer = require_png2();
    var Utf8Renderer = require_utf8();
    var TerminalRenderer = require_terminal2();
    var SvgRenderer = require_svg();
    function checkParams(text, opts, cb) {
      if (typeof text === "undefined") {
        throw new Error("String required as first argument");
      }
      if (typeof cb === "undefined") {
        cb = opts;
        opts = {};
      }
      if (typeof cb !== "function") {
        if (!canPromise()) {
          throw new Error("Callback required as last argument");
        } else {
          opts = cb || {};
          cb = null;
        }
      }
      return {
        opts,
        cb
      };
    }
    function getTypeFromFilename(path) {
      return path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    }
    function getRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "txt":
        case "utf8":
          return Utf8Renderer;
        case "png":
        case "image/png":
        default:
          return PngRenderer;
      }
    }
    function getStringRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "terminal":
          return TerminalRenderer;
        case "utf8":
        default:
          return Utf8Renderer;
      }
    }
    function render(renderFunc, text, params) {
      if (!params.cb) {
        return new Promise(function(resolve3, reject) {
          try {
            const data = QRCode2.create(text, params.opts);
            return renderFunc(data, params.opts, function(err, data2) {
              return err ? reject(err) : resolve3(data2);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, params.opts);
        return renderFunc(data, params.opts, params.cb);
      } catch (e) {
        params.cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = require_browser().toCanvas;
    exports.toString = function toString(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const type = params.opts ? params.opts.type : void 0;
      const renderer = getStringRendererFromType(type);
      return render(renderer.render, text, params);
    };
    exports.toDataURL = function toDataURL(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToDataURL, text, params);
    };
    exports.toBuffer = function toBuffer(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToBuffer, text, params);
    };
    exports.toFile = function toFile(path, text, opts, cb) {
      if (typeof path !== "string" || !(typeof text === "string" || typeof text === "object")) {
        throw new Error("Invalid argument");
      }
      if (arguments.length < 3 && !canPromise()) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, cb);
      const type = params.opts.type || getTypeFromFilename(path);
      const renderer = getRendererFromType(type);
      const renderToFile = renderer.renderToFile.bind(null, path);
      return render(renderToFile, text, params);
    };
    exports.toFileStream = function toFileStream(stream, text, opts) {
      if (arguments.length < 2) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, stream.emit.bind(stream, "error"));
      const renderer = getRendererFromType("png");
      const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
      render(renderToFileStream, text, params);
    };
  }
});

// apps/mobile/node_modules/qrcode/lib/index.js
var require_lib = __commonJS({
  "apps/mobile/node_modules/qrcode/lib/index.js"(exports, module) {
    module.exports = require_server();
  }
});

// integrations/heming-agent/cli.mjs
var import_qrcode = __toESM(require_lib(), 1);
import { homedir } from "node:os";
import { resolve as resolve2 } from "node:path";

// integrations/heming-agent/transport.mjs
import { request as httpsRequest } from "node:https";
import { Readable } from "node:stream";
var HEMING_ORIGIN = "https://60.205.169.44:38473";
var ca = true ? "-----BEGIN CERTIFICATE-----\nMIIEXTCCAsWgAwIBAgIUXelNvakJ6+Iuk8HrEU+hrIiNQFcwDQYJKoZIhvcNAQEL\nBQAwPjEVMBMGA1UECgwMQ2xlYXIgU2lnbmFsMSUwIwYDVQQDDBxDbGVhciBTaWdu\nYWwgUHJpdmF0ZSBSb290IENBMB4XDTI2MDgxMzAzNDA1MVoXDTM2MDgxMDAzNDA1\nMVowPjEVMBMGA1UECgwMQ2xlYXIgU2lnbmFsMSUwIwYDVQQDDBxDbGVhciBTaWdu\nYWwgUHJpdmF0ZSBSb290IENBMIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKC\nAYEAszj+/7/9oKlHVtB0Ujq1oK1GohzFbuO3Hbq+00qOz3+Q4gM8DvzMp0QLBXew\nCesFjTd1KfT2im9XUBWvIkfdUXp7G1lb/adZULfZJVHv8rDo7ld1XcCu/0nWCjLd\n8DNIPjex1ZEWpd/emPG5NhMh2ySGGvdmBgFnZ+GQWUftj694EF+L0PP7NdxQ4kSG\nXiOtBvtH9eiSDIUf12tglfdLNX+coG/SCIt2WtOkkeMHGHI0SZOnC3+k7GGCHv58\nSjSn6pTZSRtsqo/IprHajvQCHdPM4IyI8DVuz7KnrNxi2e8Hxd8i65qfAiJCR+q5\nwbyEZrOHTWqJVfJhTxlkW2XF6nsfxBYdIw3jRTzEC/GcH2s7KsIJeHwqVvPQ3ttf\nrljDu+GiozpZXCzB1n3IPU+Hi2aBpHD4mR76MFl2PZ3w0y5sZIBM9+pxuu1Tu+aR\n5ZEtsAkZP4d8f7qr4etbVM+azZB5c3QUucQuMI8WaUX6Ho1noE2d4hRzFKf/1fTW\noEAZAgMBAAGjUzBRMB0GA1UdDgQWBBSc4l+oCes07KuslbvIJ/mMoe+35zAfBgNV\nHSMEGDAWgBSc4l+oCes07KuslbvIJ/mMoe+35zAPBgNVHRMBAf8EBTADAQH/MA0G\nCSqGSIb3DQEBCwUAA4IBgQBSKNDpcCJ+YzKNZL0P7/lQX7dPivtrhsQhlNvOUNqu\nxnF3MfQsBI4AAzG9dSWW9IIZ9Z3SvZe92EsCajRvAYURUNRCHUCimzo5DJWmtJhq\n3WJR9WRvW2uIOPsvC5hBWy07vPVxapPm1Rgc1BigkvJbO02jnAoxnxkTGJPOFHq2\nLg3L8YrejHyonGhz9o6tPjvBLIWbDXsGUjUSbrs0gGLitBfR38ZVBjXZuSYu0TJC\n2G6L6SISMNGZkRkuenPCZmdXXVi8CDZCWx0x+m5k+zA3LGqKjuYQ+Ich9xJdocQE\nC16oOABAcwsw/9irEk/V3ra91WFiCOwFh3q5oZR4kTFL3lED/p6BtnrqmGk/bz/V\nrNm+wTZJcwu7SUirk1d76D8Ncbn2u1wlOhSLPfNwbOfDDZwsD5ClQegAUozQHH/G\nCIfBwSfbSeH3gLYtqxjsXPTpmo9FVNxhm1nZVoqjPUvHUoLe+223Tce4kHkIO1gA\nIpqhgef0iVZw6lOBbg0xXfk=\n-----END CERTIFICATE-----\n" : readFileSync(new URL("../../apps/mobile/android/app/src/main/res/raw/clear_signal_ca.crt", import.meta.url));
function createAgentTransport({ origin = HEMING_ORIGIN, fetchImpl } = {}) {
  const base = new URL(origin);
  if (base.origin !== origin || !["https:", "http:"].includes(base.protocol) || base.protocol !== "https:" && !["127.0.0.1", "localhost"].includes(base.hostname))
    throw Error("AGENT_ORIGIN_NOT_SECURE");
  const transportFetch = fetchImpl || (base.origin !== HEMING_ORIGIN ? globalThis.fetch : (url, options = {}) => new Promise((resolve3, reject) => {
    const request = httpsRequest(url, { method: options.method, headers: options.headers, ca, signal: options.signal }, (response) => {
      resolve3(new Response(Readable.toWeb(response), { status: response.statusCode, headers: response.headers }));
    });
    request.once("error", reject);
    request.end(options.body);
  }));
  const api = async (path, { token: token2, body, method = body ? "POST" : "GET", signal } = {}) => {
    if (!path.startsWith("/api/v1/")) throw Error("INVALID_AGENT_API_PATH");
    const response = await transportFetch(origin + path, { method, redirect: "error", headers: {
      "Content-Type": "application/json",
      ...token2 ? { "x-device-token": token2 } : {}
    }, ...body ? { body: JSON.stringify(body) } : {}, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15e3)]) : AbortSignal.timeout(15e3) });
    const result = await response.json();
    if (!response.ok) throw Object.assign(Error(result.error || "AGENT_REQUEST_FAILED"), { status: response.status });
    return result;
  };
  return { api, origin, fetchImpl: transportFetch };
}

// integrations/heming-agent/stateStore.mjs
import { chmodSync, closeSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync, lstatSync, fsyncSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
function createAgentStateStore(path) {
  const file = resolve(path);
  mkdirSync(dirname(file), { recursive: true, mode: 448 });
  try {
    if (lstatSync(file).isSymbolicLink()) throw Error("AGENT_STATE_SYMLINK_REJECTED");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  let lock;
  return {
    read() {
      try {
        return JSON.parse(readFileSync(file, "utf8"));
      } catch (error) {
        if (error.code === "ENOENT") return null;
        throw Error("AGENT_STATE_UNREADABLE", { cause: error });
      }
    },
    write(value) {
      const temporary = `${file}.${randomUUID()}.tmp`;
      const fd = openSync(temporary, "wx", 384);
      try {
        writeFileSync(fd, JSON.stringify(value));
        fsyncSync(fd);
        closeSync(fd);
        renameSync(temporary, file);
        chmodSync(file, 384);
      } catch (error) {
        try {
          closeSync(fd);
        } catch {
        }
        try {
          unlinkSync(temporary);
        } catch {
        }
        throw error;
      }
    },
    lock() {
      if (lock != null) throw Error("AGENT_STATE_ALREADY_LOCKED");
      try {
        lock = openSync(`${file}.lock`, "wx", 384);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        const pid = Number(readFileSync(`${file}.lock`, "utf8"));
        if (!Number.isSafeInteger(pid) || pid <= 0) throw Error("AGENT_STATE_LOCKED");
        try {
          process.kill(pid, 0);
          throw Error("AGENT_STATE_LOCKED");
        } catch (reason) {
          if (reason.code !== "ESRCH") throw reason;
        }
        unlinkSync(`${file}.lock`);
        lock = openSync(`${file}.lock`, "wx", 384);
      }
      writeFileSync(lock, String(process.pid));
      fsyncSync(lock);
    },
    unlock() {
      if (lock != null) {
        closeSync(lock);
        lock = null;
        unlinkSync(`${file}.lock`);
      }
    }
  };
}

// integrations/heming-agent/ensurePairing.mjs
import { setTimeout as delay } from "node:timers/promises";

// node_modules/@noble/hashes/_u64.js
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE ? l : h, isLE);
  view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}

// node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value, length, title = "") {
  if (isBytes(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
var aobject = (value, label) => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
function asciiToBase16(ch) {
  return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new TypeError("hex string expected, got " + typeof hex);
  if (hasHexBuiltin) {
    try {
      return Uint8Array.fromHex(hex);
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new RangeError(error.message);
      throw error;
    }
  }
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new TypeError("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function checkOpts(defaults, opts, title = "opts") {
  aobject(defaults, "defaults");
  if (opts !== void 0)
    aobject(opts, title);
  const merged = Object.assign(defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  anumber(bytesLength, "bytesLength");
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (bytesLength > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    let processed = false;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        processed = true;
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
        processed = true;
      }
    }
    this.length += data.length;
    if (processed)
      this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    buffer.fill(0, pos);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      buffer.fill(0);
    }
    setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
    this.process(view, 0);
    this.roundClean();
    const oview = out === buffer ? view : createView(out);
    const len = this.outputLen;
    const outLen = len / 4;
    const state = this.get();
    if (len % 4 || outLen > state.length)
      throw new Error("invalid outputLen");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneIntoMeta(to) {
    const { buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (pos)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and makes sha256 3x slower (measured).
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor(outputLen, IV) {
    super(64, outputLen, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  constructor() {
    super(32, SHA256_IV);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);

// node_modules/@noble/curves/utils.js
function aarray(item, title, inner = () => {
}) {
  if (!Array.isArray(item))
    throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
  for (let i = 0; i < item.length; i++)
    inner(item[i], `${title}[${i}]`);
  return item;
}
var abytes2 = (value, length, title) => abytes(value, length, title);
var anumber2 = anumber;
function aobject2(value, title = "object") {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
  return value;
}
function afunction(value, title) {
  if (typeof value !== "function")
    throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
  return value;
}
var bytesToHex2 = bytesToHex;
var hexToBytes2 = (hex) => hexToBytes(hex);
var isBytes2 = isBytes;
var randomBytes2 = (bytesLength) => randomBytes(bytesLength);
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var atitle2 = (title) => title ? `"${title}" ` : "";
function abool(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new RangeError("positive bigint expected, got " + n);
  } else
    anumber2(n);
  return n;
}
function asafenumber(value, title = "") {
  if (typeof value !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected number, got type=" + typeof value);
  }
  if (!Number.isSafeInteger(value)) {
    const prefix = title && `"${title}" `;
    throw new RangeError(prefix + "expected safe integer, got " + value);
  }
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new TypeError("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  if (len === 0)
    throw new Error("zero output length is invalid");
  n = abignumber(n);
  const expectedLen = len * 2;
  const hex = n.toString(16);
  if (hex.length > expectedLen)
    throw new RangeError("number is too large");
  return hexToBytes(hex.padStart(expectedLen, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes2(bytes));
}
function isPosBig(n) {
  return typeof n === "bigint" && _0n <= n;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  if (n < _0n)
    throw new Error("expected non-negative bigint, got " + n);
  return n === _0n ? 0 : n.toString(2).length;
}
var bitMask = (n) => {
  asafenumber(n, "n");
  return (_1n << BigInt(n)) - _1n;
};
function validateObject(object, fields = {}, optFields = {}, title = "object") {
  aobject2(object, title);
  aobject2(fields, "fields");
  aobject2(optFields, "optFields");
  function checkField(fieldName, expectedType, isOpt) {
    const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
    const val = object[fieldName];
    if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
      throw new TypeError(`${label} is invalid: expected own property`);
    }
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}

// node_modules/@noble/curves/abstract/modular.js
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _15n = /* @__PURE__ */ BigInt(15);
var _16n = /* @__PURE__ */ BigInt(16);
var POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
function mod(a, b) {
  if (b <= _0n2)
    throw new Error("mod: expected positive modulus, got " + b);
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow: expected modulus > 1, got " + modulo);
  if (typeof power !== "bigint")
    throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return _1n2;
  if (power === _1n2)
    return num;
  let d = num % modulo;
  if (d < _0n2)
    d += modulo;
  if (power < POW_WINDOWED_MIN) {
    let p2 = _1n2;
    while (power > _0n2) {
      if (power & _1n2)
        p2 = p2 * d % modulo;
      d = d * d % modulo;
      power >>= _1n2;
    }
    return p2;
  }
  const digits = [];
  while (power > _0n2) {
    digits.push(Number(power & _15n));
    power >>= _4n;
  }
  const table = new Array(16);
  table[0] = _1n2;
  table[1] = d;
  for (let i = 2; i < 16; i++)
    table[i] = table[i - 1] * d % modulo;
  let p = table[digits[digits.length - 1]];
  for (let w = digits.length - 2; w >= 0; w--) {
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    const digit = digits[w];
    if (digit !== 0)
      p = p * table[digit] % modulo;
  }
  return p;
}
function pow2(x, power, modulo) {
  if (modulo <= _1n2)
    throw new Error("pow2: expected modulus > 1, got " + modulo);
  if (power < _0n2)
    throw new Error("pow2: expected non-negative exponent, got " + power);
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _1n2)
    throw new Error("invert: expected modulus > 1, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, u = _1n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b - a * q;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
  const F = Fp;
  if (!F.eql(F.sqr(root), n))
    throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
  if ((order & _1n2) === _0n2)
    throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp, n) {
  const F = Fp;
  const p1div4 = (F.ORDER + _1n2) / _4n;
  const root = F.pow(n, p1div4);
  assertIsSquare(F, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const F = Fp;
  const p5div8 = (F.ORDER - _5n) / _8n;
  const n2 = F.mul(n, _2n);
  const v = F.pow(n2, p5div8);
  const nv = F.mul(n, v);
  const i = F.mul(F.mul(nv, _2n), v);
  const root = F.mul(nv, F.sub(i, F.ONE));
  assertIsSquare(F, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return ((Fp, n) => {
    const F = Fp;
    let tv1 = F.pow(n, c4);
    let tv2 = F.mul(tv1, c1);
    const tv3 = F.mul(tv1, c2);
    const tv4 = F.mul(tv1, c3);
    const e1 = F.eql(F.sqr(tv2), n);
    const e2 = F.eql(F.sqr(tv3), n);
    tv1 = F.cmov(tv1, tv2, e1);
    tv2 = F.cmov(tv4, tv3, e2);
    const e3 = F.eql(F.sqr(tv2), n);
    const root = F.cmov(tv1, tv2, e3);
    assertIsSquare(F, root, n);
    return root;
  });
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  aoddModulus(P, "tonelliShanks");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    const F = Fp;
    if (F.is0(n))
      return n;
    if (FpLegendre(F, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = F.mul(F.ONE, cc);
    let t = F.pow(n, Q);
    let R = F.pow(n, Q1div2);
    while (!F.eql(t, F.ONE)) {
      if (F.is0(t))
        throw new Error("Cannot find square root: probably non-prime P");
      let i = 1;
      let t_tmp = F.sqr(t);
      while (!F.eql(t_tmp, F.ONE)) {
        i++;
        t_tmp = F.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = F.pow(c, exponent);
      M = i;
      c = F.sqr(b);
      t = F.mul(t, c);
      R = F.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  aoddModulus(P, "Fp.sqrt");
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  aobject2(field, "field");
  if (typeof field.ORDER !== "bigint")
    throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
  asafenumber(field.BYTES, "BYTES");
  asafenumber(field.BITS, "BITS");
  for (const name of FIELD_FIELDS)
    afunction(field[name], "field." + name);
  if (field.BYTES < 1 || field.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (field.ORDER <= _1n2)
    throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
  return field;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  validateField(Fp);
  aarray(nums, "nums");
  abool(passZero, "passZero");
  const F = Fp;
  const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (F.is0(num))
      return acc;
    inverted[i] = acc;
    return F.mul(acc, num);
  }, F.ONE);
  const invertedAcc = F.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (F.is0(num))
      return acc;
    inverted[i] = F.mul(acc, inverted[i]);
    return F.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  validateField(Fp);
  const F = Fp;
  aoddModulus(F.ORDER, "FpLegendre");
  const p1mod2 = (F.ORDER - _1n2) / _2n;
  const powered = F.pow(n, p1mod2);
  const yes = F.eql(powered, F.ONE);
  const zero = F.eql(powered, F.ZERO);
  const no = F.eql(powered, F.neg(F.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber2(nBitLength);
  if (n <= _0n2)
    throw new Error("invalid n length: expected positive n, got " + n);
  if (nBitLength !== void 0 && nBitLength < 1)
    throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
  const bits = bitLen(n);
  if (nBitLength !== void 0 && nBitLength < bits)
    throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
var FIELD_SQRT = /* @__PURE__ */ new WeakMap();
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _1n2)
      throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number")
        _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function")
        Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
      if (typeof opts.isLE === "boolean")
        this.isLE = opts.isLE;
      if (opts.allowedLengths)
        this._lengths = Object.freeze(opts.allowedLengths.slice());
      if (typeof opts.modFromBytes === "boolean")
        this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    Object.freeze(this);
  }
  create(num) {
    return mod(num, this.ORDER);
  }
  isValid(num) {
    if (typeof num !== "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof num);
    return _0n2 <= num && num < this.ORDER;
  }
  is0(num) {
    return num === _0n2;
  }
  // is valid and invertible
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  isOdd(num) {
    return (num & _1n2) === _1n2;
  }
  neg(num) {
    return mod(-num, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num) {
    return mod(num * num, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num, power) {
    return pow(num, power, this.ORDER);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num) {
    return num * num;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num) {
    return invert(num, this.ORDER);
  }
  sqrt(num) {
    let sqrt = FIELD_SQRT.get(this);
    if (!sqrt)
      FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
    return sqrt(this, num);
  }
  toBytes(num) {
    return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes2(bytes);
    const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes)
      scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst, true);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    abool(condition, "condition");
    return condition ? b : a;
  }
};
function Field(ORDER, opts = {}) {
  Object.freeze(_Field.prototype);
  return new _Field(ORDER, opts);
}

// node_modules/@noble/curves/abstract/curve.js
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
var _4n2 = /* @__PURE__ */ BigInt(4);
var BLIND_BYTES = 16;
var BLIND_BITS = 128;
var FW_WINDOW = 5;
var TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
function validatePointCons(Point) {
  const pc = Point;
  if (typeof pc !== "function")
    throw new TypeError('"Point" expected constructor, got type=' + typeof Point);
  afunction(pc.fromAffine, "Point.fromAffine");
  afunction(pc.fromBytes, "Point.fromBytes");
  afunction(pc.fromHex, "Point.fromHex");
  aobject2(pc.BASE, "Point.BASE");
  aobject2(pc.ZERO, "Point.ZERO");
  validateField(pc.Fp);
  validateField(pc.Fn);
}
function normalizeZ(c, points) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
  if (!Number.isSafeInteger(W) || W < min || W > bits)
    throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
  const bytes = numPoints * (4 * fpBytes + 128);
  if (bytes > TABLE_BYTES_MAX)
    throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
function probeRandomBytes(randomBytes3, length) {
  if (randomBytes3 === void 0)
    return void 0;
  afunction(randomBytes3, "randomBytes");
  try {
    const probe = randomBytes3(length);
    if (!isBytes2(probe) || probe.length !== length)
      return void 0;
  } catch {
    return void 0;
  }
  return randomBytes3;
}
function validateMSMPoints(points, c) {
  aarray(points, "points");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field, maxScalar) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
    if (!ok)
      throw new Error("invalid scalar at index " + i);
  });
}
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getWindowSize(P) {
  return pointWindowSizes.get(P) || 1;
}
function oddMultiples(p, size) {
  const dbl = p.double();
  const t = [p];
  for (let j = 1; j < size; j++)
    t.push(t[j - 1].add(dbl));
  return t;
}
function wnafDigits(n, W) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const d = [];
  while (n > _0n3) {
    let w = 0;
    if (n & _1n3) {
      w = Number(n & mask);
      if (w >= half)
        w -= size;
      n -= BigInt(w);
    }
    d.push(w);
    n >>= _1n3;
  }
  return d;
}
function signedWindowDigits(n, W, windows) {
  const size = 2 ** W;
  const half = size / 2;
  const mask = BigInt(size - 1);
  const shiftBy = BigInt(W);
  const d = [];
  for (let w = 0; w < windows; w++) {
    let v = Number(n & mask);
    n >>= shiftBy;
    if (v > half) {
      v -= size;
      n += _1n3;
    }
    d.push(v);
  }
  if (n !== _0n3)
    throw new Error("invalid wnaf");
  return d;
}
function wnafWalk(zero, tables, digits) {
  let max = 0;
  for (const d of digits)
    max = Math.max(max, d.length);
  let acc = zero;
  for (let bit = max - 1; bit >= 0; bit--) {
    if (bit !== max - 1)
      acc = acc.double();
    for (let i = 0; i < digits.length; i++) {
      const w = digits[i][bit];
      if (w) {
        const item = tables[i][Math.abs(w) - 1 >> 1];
        acc = acc.add(w < 0 ? item.negate() : item);
      }
    }
  }
  return acc;
}
var ScalarMultiplier = class {
  Point;
  BASE;
  ZERO;
  randomBytes;
  wnafPrecomputes = /* @__PURE__ */ new WeakMap();
  baseCanBeBlinded;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point, randomBytes3) {
    validatePointCons(Point);
    this.randomBytes = probeRandomBytes(randomBytes3, BLIND_BYTES);
    this.Point = Point;
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.bits = Point.Fn.BITS;
  }
  /**
   * Creates a signed fixed-window wNAF precomputation table: for every window w, the
   * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
   * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
   * window absorbs the final carry of signed-digit recoding.
   * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
   * @param point - Point instance
   * @param W - window size
   * @param bits - scalar bitlength the table must cover
   */
  buildWnafTable(point, W, bits) {
    const windows = Math.ceil(bits / W) + 1;
    const half = 2 ** (W - 1);
    const comp = [];
    let base = point;
    for (let w = 0; w < windows; w++) {
      let acc = base;
      for (let i = 0; i < half; i++) {
        comp.push(acc);
        acc = acc.add(base);
      }
      base = comp[comp.length - 1].double();
    }
    return { W, bits, windows, comp };
  }
  /**
   * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
   * Constant-time: fixed window count with one table addition per window — zero digits feed
   * the fake accumulator — and no doublings; the lookup scans the whole window slice.
   * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
   * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
   * signedWindowDigits throws if `n` exceeds the table.
   * @returns real and fake (for const-time) points
   */
  wnafCachedCT(precomputes, n) {
    const { W, windows, comp } = precomputes;
    const half = 2 ** (W - 1);
    const digits = signedWindowDigits(n, W, windows);
    let p = this.ZERO;
    let f = this.BASE;
    for (let w = 0; w < windows; w++) {
      const digit = digits[w];
      const start = w * half;
      const idx = Math.abs(digit) - 1;
      let sel = comp[start];
      for (let i = 1; i < half; i++)
        sel = i === idx ? comp[start + i] : sel;
      const neg = sel.negate();
      if (digit === 0)
        f = f.add(comp[start]);
      else
        p = p.add(digit < 0 ? neg : sel);
    }
    return { p, f };
  }
  // Cache key is point identity plus (W, bits); at most two entries exist per point (public-width
  // `Fn.BITS` and blinded `Fn.BITS + BLIND_BITS`). Callers must not reuse the same point with
  // incompatible `transform(...)` layouts and expect a separate cache entry.
  getWnafPrecomputes(W, point, bits, transform) {
    let entries = this.wnafPrecomputes.get(point);
    let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
    if (!comp) {
      comp = this.buildWnafTable(point, W, bits);
      if (typeof transform === "function")
        comp = { ...comp, comp: transform(comp.comp) };
      if (!entries) {
        entries = [];
        this.wnafPrecomputes.set(point, entries);
      }
      entries.push(comp);
    }
    return comp;
  }
  assertPoint(point) {
    if (!(point instanceof this.Point))
      throw new TypeError('"point" expected Point instance, got type=' + typeof point);
  }
  // Shared prologue of the constant-time entry points. Rejects scalar 0: in key/signature-style
  // callers a zero scalar means broken upstream plumbing, and concrete Points already reject it.
  // Uses inRange instead of Fn.isValidNot0: validateField() only certifies the arithmetic subset.
  validateMulInput(point, scalar) {
    this.assertPoint(point);
    if (!inRange(scalar, _1n3, this.Point.Fn.ORDER))
      throw new Error("invalid scalar");
  }
  // Constant-time dispatch shared by mulCT / mulCTBlinded. Un-precomputed points (W===1, e.g.
  // ECDH peer keys) skip building a throwaway cached table in favor of a small fixed-window
  // multiply. `n` must be < 2^bits.
  runCT(point, n, bits, transform) {
    const W = getWindowSize(point);
    if (W === 1)
      return this.fixedWindowCT(point, n, bits);
    return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
  }
  mulCT(point, scalar, transform) {
    this.validateMulInput(point, scalar);
    return this.runCT(point, scalar, this.bits, transform);
  }
  mulCTBlinded(point, scalar, transform) {
    this.validateMulInput(point, scalar);
    if (this.randomBytes === void 0)
      throw new Error("randomBytes is required for scalar blinding");
    const bits = this.Point.Fn.BITS + BLIND_BITS;
    const blind = this.randomBytes(BLIND_BYTES);
    if (!isBytes2(blind) || blind.length !== BLIND_BYTES)
      throw new Error("randomBytes returned invalid byte array");
    blind[0] = blind[0] & 63 | 128;
    const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
    return this.runCT(point, n, bits, transform);
  }
  /**
   * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
   * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
   * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
   * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
   * every table entry, and one addition (adds the identity when the window digit is 0 — never
   * skipped).
   *
   * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
   * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
   * projective form (no normalizeZ): normalizing this small a table costs more than the
   * mixed-add savings it would buy for a single multiply.
   * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
   * (this path needs no fake accumulator — its op-count is already scalar-independent).
   */
  fixedWindowCT(point, n, bits) {
    const W = FW_WINDOW;
    const size = 1 << W;
    const mask = bitMask(W);
    const table = new Array(size);
    table[0] = this.ZERO;
    for (let i = 1; i < size; i++)
      table[i] = table[i - 1].add(point);
    const windows = Math.ceil(bits / W);
    let acc = this.ZERO;
    for (let window = windows - 1; window >= 0; window--) {
      if (window !== windows - 1)
        for (let d = 0; d < W; d++)
          acc = acc.double();
      const digit = Number(n >> BigInt(window * W) & mask);
      let sel = table[0];
      for (let i = 1; i < size; i++)
        sel = i === digit ? table[i] : sel;
      acc = acc.add(sel);
    }
    return { p: acc, f: acc };
  }
  shouldBlind(point, cofactor) {
    if (this.randomBytes === void 0)
      return false;
    if (cofactor === _1n3)
      return true;
    if (point !== this.BASE)
      return false;
    if (this.baseCanBeBlinded === void 0)
      this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
    return this.baseCanBeBlinded;
  }
  mulSecret(point, scalar, cofactor, transform) {
    return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
  }
  mulUnsafe(point, scalar, transform) {
    this.assertPoint(point);
    if (!isPosBig(scalar))
      throw new Error("invalid scalar");
    const W = getWindowSize(point);
    if (W === 1 || scalar >= this.Point.Fn.ORDER)
      return mulAddUnsafe(this.Point, [point], [scalar], true);
    const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
    return this.wnafCachedCT(precomputes, scalar).p;
  }
  // Remembers the window size used for precomputed wNAF multiplication of the given point
  // and drops any previously built tables. Usually only the base point is precomputed.
  // W=1 resets the point to the un-precomputed (table-less) paths.
  // W is additionally capped so tables stay under ~2 GiB ({@link TABLE_BYTES_MAX}).
  setWindowSize(point, W) {
    this.assertPoint(point);
    validateW(W, this.bits);
    const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
    validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
    pointWindowSizes.set(point, W);
    this.wnafPrecomputes.delete(point);
  }
  // True when a window size is set: tables themselves are built lazily on first multiply.
  hasWindowSize(point) {
    return getWindowSize(point) !== 1;
  }
};
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  abool(allowOversized, "allowOversized");
  validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const tables = points.map((p) => oddMultiples(p, 4));
  const digits = scalars.map((n) => wnafDigits(n, 4));
  return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (type !== "weierstrass" && type !== "edwards")
    throw new Error('expected curve type "weierstrass" or "edwards"');
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  validateObject(curveOpts);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(isPosBig(val) && val !== _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn };
}
function createKeygen(randomSecretKey, getPublicKey) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  };
}

// node_modules/@noble/curves/abstract/edwards.js
var _0n4 = /* @__PURE__ */ BigInt(0);
var _1n4 = /* @__PURE__ */ BigInt(1);
var _2n2 = /* @__PURE__ */ BigInt(2);
var _4n3 = /* @__PURE__ */ BigInt(4);
var _8n2 = /* @__PURE__ */ BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
  const x2 = Fp.sqr(x);
  const y2 = Fp.sqr(y);
  const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
  const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
  return Fp.eql(left, right);
}
function edwards(params, extraOpts = {}) {
  validateObject(extraOpts, {}, {}, "extraOpts");
  const opts = extraOpts;
  const validated = createCurveFields("edwards", params, opts, opts.FpFnLE);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor } = CURVE;
  if (FpLegendre(Fp, CURVE.a) !== 1)
    throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
  if (FpLegendre(Fp, CURVE.d) !== -1)
    throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
  validateObject(opts, {}, { uvRatio: "function", randomBytes: "function" });
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const MASK = _2n2 << BigInt(Fp.BYTES * 8) - _1n4;
  function isOdd(n) {
    if (!Fp.isOdd)
      throw new Error("Field does not have .isOdd()");
    return Fp.isOdd(n);
  }
  const uvRatio2 = opts.uvRatio === void 0 ? (u, v) => {
    try {
      return { isValid: true, value: Fp.sqrt(Fp.div(u, v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  } : opts.uvRatio;
  if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const mulA = Fp.eql(CURVE.a, Fp.neg(Fp.ONE)) ? (x) => Fp.neg(x) : Fp.eql(CURVE.a, Fp.ONE) ? (x) => x : (x) => Fp.mul(CURVE.a, x);
  function acoord(title, n, banZero = false) {
    const min = banZero ? _1n4 : _0n4;
    aInRange("coordinate " + title, n, min, MASK);
    return n;
  }
  function aedpoint(other) {
    if (!(other instanceof Point))
      throw new Error("EdwardsPoint expected");
  }
  class Point {
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE, Fp.mul(CURVE.Gx, CURVE.Gy));
    static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ONE, Fp.ZERO);
    static Fp = Fp;
    static Fn = Fn;
    X;
    Y;
    Z;
    T;
    constructor(X, Y, Z, T) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y);
      this.Z = acoord("z", Z, true);
      this.T = acoord("t", T);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /**
     * Create one extended Edwards point from affine coordinates.
     * Does NOT validate that the point is on-curve or torsion-free.
     * Use `.assertValidity()` on adversarial inputs.
     */
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      acoord("x", x);
      acoord("y", y);
      return new Point(x, y, Fp.ONE, Fp.mul(x, y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(bytes, zip215 = false) {
      const len = Fp.BYTES;
      const { a, d } = CURVE;
      bytes = copyBytes(abytes2(bytes, len, "point"));
      abool(zip215, "zip215");
      const normed = copyBytes(bytes);
      const lastByte = bytes[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp.ORDER;
      aInRange("point.y", y, _0n4, max);
      const y2 = Fp.sqr(y);
      const u = Fp.sub(y2, Fp.ONE);
      const v = Fp.sub(Fp.mulN(d, y2), a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("bad point: invalid y coordinate");
      const isXOdd = isOdd(x);
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && Fp.is0(x) && isLastByteOdd)
        throw new Error("bad point: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = Fp.neg(x);
      return Point.fromAffine({ x, y });
    }
    static fromHex(hex, zip215 = false) {
      return Point.fromBytes(hexToBytes2(hex), zip215);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(windowSize = 6, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_2n2);
      return this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this;
      const { a, d } = CURVE;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X, Y, Z, T } = p;
      const X2 = Fp.sqr(X);
      const Y2 = Fp.sqr(Y);
      const Z2 = Fp.sqr(Z);
      const Z4 = Fp.sqr(Z2);
      const aX2 = Fp.mul(X2, a);
      const left = Fp.mul(Fp.add(aX2, Y2), Z2);
      const right = Fp.add(Z4, Fp.mul(d, Fp.mul(X2, Y2)));
      if (!Fp.eql(left, right))
        throw new Error("bad point: equation left != right (1)");
      const XY = Fp.mul(X, Y);
      const ZT = Fp.mul(Z, T);
      if (!Fp.eql(XY, ZT))
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(other) {
      aedpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const X1Z2 = Fp.mul(X1, Z2);
      const X2Z1 = Fp.mul(X2, Z1);
      const Y1Z2 = Fp.mul(Y1, Z2);
      const Y2Z1 = Fp.mul(Y2, Z1);
      return Fp.eql(X1Z2, X2Z1) && Fp.eql(Y1Z2, Y2Z1);
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(Fp.neg(this.X), this.Y, this.Z, Fp.neg(this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const A = Fp.sqr(X1);
      const B = Fp.sqr(Y1);
      const C = Fp.mul(Fp.sqr(Z1), _2n2);
      const D = mulA(A);
      const x1y1 = Fp.addN(X1, Y1);
      const E = Fp.sub(Fp.subN(Fp.sqr(x1y1), A), B);
      const G = Fp.addN(D, B);
      const F = Fp.subN(G, C);
      const H = Fp.subN(D, B);
      const X3 = Fp.mul(E, F);
      const Y3 = Fp.mul(G, H);
      const T3 = Fp.mul(E, H);
      const Z3 = Fp.mul(F, G);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      aedpoint(other);
      const { d } = CURVE;
      const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
      const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
      const A = Fp.mul(X1, X2);
      const B = Fp.mul(Y1, Y2);
      const C = Fp.mul(Fp.mulN(T1, d), T2);
      const D = Fp.mul(Z1, Z2);
      const E = Fp.sub(Fp.subN(Fp.mulN(Fp.addN(X1, Y1), Fp.addN(X2, Y2)), A), B);
      const F = Fp.subN(D, C);
      const G = Fp.addN(D, C);
      const H = Fp.sub(B, mulA(A));
      const X3 = Fp.mul(E, F);
      const Y3 = Fp.mul(G, H);
      const T3 = Fp.mul(E, H);
      const Z3 = Fp.mul(F, G);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      aedpoint(other);
      return this.add(other.negate());
    }
    // Constant-time multiplication.
    multiply(scalar) {
      if (!Fn.isValidNot0(scalar))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize);
      return normalize([p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(scalar) {
      if (!Fn.isValid(scalar))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      if (scalar === _0n4)
        return Point.ZERO;
      if (this.is0() || scalar === _1n4)
        return this;
      return wnaf.mulUnsafe(this, scalar, normalize);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Clears cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.clearCofactor().is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.mulUnsafe(this, CURVE.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      if (iz != null && typeof iz !== "bigint")
        throw new TypeError('"invertedZ" expected bigint, got type=' + typeof iz);
      const { X, Y, Z } = p;
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.create(_8n2) : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ONE };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    clearCofactor() {
      if (cofactor === _1n4)
        return this;
      if (cofactor === _2n2)
        return this.double();
      if (cofactor === _4n3)
        return this.double().double();
      if (cofactor === _8n2)
        return this.double().double().double();
      return this.multiplyUnsafe(cofactor);
    }
    toBytes() {
      const { x, y } = this.toAffine();
      const bytes = Fp.toBytes(y);
      bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex2(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const normalize = (points) => normalizeZ(Point, points);
  const wnaf = new ScalarMultiplier(Point, randomBytes3);
  if (wnaf.bits >= 6)
    Point.BASE.precompute(6);
  Object.freeze(Point.prototype);
  Object.freeze(Point);
  return Point;
}

// node_modules/@noble/curves/abstract/montgomery.js
var _0n5 = /* @__PURE__ */ BigInt(0);
var _1n5 = /* @__PURE__ */ BigInt(1);
var _2n3 = /* @__PURE__ */ BigInt(2);
function cmask(P, swap) {
  return P + swap - (swap >> _1n5 << _1n5);
}
function cswap(P) {
  const offset = BigInt(6) * P;
  return (mask, x_2, x_3) => {
    const sum = x_2 + x_3;
    const d = offset + x_3 - x_2;
    const a = (d * mask + x_2) % P;
    return { x_2: a, x_3: sum - a };
  };
}
function validateOpts(curve) {
  validateObject(curve, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function",
    scalarMultBase: "function"
  });
  return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { P, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
  const mulBaseHook = CURVE.scalarMultBase;
  const is25519 = type === "x25519";
  if (!is25519 && type !== "x448")
    throw new Error("invalid type");
  const randomBytes_ = rand === void 0 ? randomBytes2 : rand;
  const montgomeryBits = is25519 ? 255 : 448;
  const swap = cswap(P);
  const fieldLen = is25519 ? 32 : 56;
  const Gu = is25519 ? BigInt(9) : BigInt(5);
  const a24 = is25519 ? BigInt(121665) : BigInt(39081);
  const minScalar = is25519 ? _2n3 ** BigInt(254) : _2n3 ** BigInt(447);
  const maxAdded = is25519 ? BigInt(8) * (_2n3 ** BigInt(251) - _1n5) : BigInt(4) * (_2n3 ** BigInt(445) - _1n5);
  const maxScalar = minScalar + maxAdded + _1n5;
  const modP = (n) => mod(n, P);
  const GuBytes = encodeU(Gu);
  function encodeU(u) {
    return numberToBytesLE(modP(u), fieldLen);
  }
  function decodeU(u) {
    const _u = copyBytes(abytes2(u, fieldLen, "uCoordinate"));
    if (is25519)
      _u[31] &= 127;
    return modP(bytesToNumberLE(_u));
  }
  function decodeScalar(scalar) {
    return bytesToNumberLE(adjustScalarBytes2(copyBytes(abytes2(scalar, fieldLen, "scalar"))));
  }
  const lowOrderU = new Set(is25519 ? [
    _0n5,
    _1n5,
    P - _1n5,
    BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
    BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
  ] : [_0n5, _1n5, P - _1n5]);
  function scalarMult(scalar, u) {
    const pointU = decodeU(u);
    if (lowOrderU.has(pointU))
      throw new Error("invalid private or public key received");
    const pu = montgomeryLadder(pointU, decodeScalar(scalar));
    if (pu === _0n5)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  function scalarMultBase(scalar) {
    if (mulBaseHook === void 0)
      return scalarMult(scalar, GuBytes);
    const k = decodeScalar(scalar);
    aInRange("scalar", k, minScalar, maxScalar);
    const pu = modP(mulBaseHook(k));
    if (pu === _0n5)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  const getPublicKey = scalarMultBase;
  const getSharedSecret = scalarMult;
  function montgomeryLadder(u, scalar) {
    aInRange("u", u, _0n5, P);
    aInRange("scalar", scalar, minScalar, maxScalar);
    const k = scalar;
    const x_1 = u;
    let x_2 = _1n5;
    let z_2 = _0n5;
    let x_3 = u;
    let z_3 = _1n5;
    const kx = k ^ k >> _1n5;
    for (let t = BigInt(montgomeryBits - 1); t >= _0n5; t--) {
      const mask2 = cmask(P, kx >> t);
      ({ x_2, x_3 } = swap(mask2, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = swap(mask2, z_2, z_3));
      const A = x_2 + z_2;
      const AA = modP(A * A);
      const B = x_2 - z_2;
      const BB = modP(B * B);
      const E = AA - BB;
      const C = x_3 + z_3;
      const D = x_3 - z_3;
      const DA = modP(D * A);
      const CB = modP(C * B);
      const dacb = DA + CB;
      const da_cb = DA - CB;
      x_3 = modP(dacb * dacb);
      z_3 = modP(x_1 * modP(da_cb * da_cb));
      x_2 = modP(AA * BB);
      z_2 = modP(E * (AA + modP(a24 * E)));
    }
    const mask = cmask(P, k);
    ({ x_2, x_3 } = swap(mask, x_2, x_3));
    ({ x_2: z_2, x_3: z_3 } = swap(mask, z_2, z_3));
    const z2 = powPminus2(z_2);
    return modP(x_2 * z2);
  }
  const lengths = {
    secretKey: fieldLen,
    publicKey: fieldLen,
    seed: fieldLen
  };
  const randomSecretKey = (seed) => {
    seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
    abytes2(seed, lengths.seed, "seed");
    return seed;
  };
  const utils = { randomSecretKey };
  Object.freeze(lengths);
  Object.freeze(utils);
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, getPublicKey),
    getSharedSecret,
    getPublicKey,
    scalarMult,
    scalarMultBase,
    utils,
    GuBytes: GuBytes.slice(),
    lengths
  });
}

// node_modules/@noble/curves/ed25519.js
var _0n6 = /* @__PURE__ */ BigInt(0);
var _1n6 = /* @__PURE__ */ BigInt(1);
var _2n4 = /* @__PURE__ */ BigInt(2);
var _3n2 = /* @__PURE__ */ BigInt(3);
var _5n2 = /* @__PURE__ */ BigInt(5);
var _8n3 = /* @__PURE__ */ BigInt(8);
var ed25519_CURVE_p = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = /* @__PURE__ */ (() => ({
  p: ed25519_CURVE_p,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: _8n3,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ed25519_CURVE_p;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n4, P) * b2 % P;
  const b5 = pow2(b4, _1n6, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n4, P) * x % P;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
  const P = ed25519_CURVE_p;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
var ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
var x25519 = /* @__PURE__ */ (() => {
  const P = ed25519_CURVE_p;
  const powPminus2 = (x) => {
    const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
    return mod(pow2(pow_p_5_8, _3n2, P) * b2, P);
  };
  return montgomery({
    P,
    type: "x25519",
    powPminus2,
    adjustScalarBytes,
    // ~3x faster fixed-base: [k]B on the birationally-equivalent Edwards curve using cached
    // base tables, mapped back via u = (1+y)/(1-y) = (Z+Y)/(Z-Y) with one Fermat inversion.
    // Same construction as libsodium's crypto_scalarmult_curve25519_base.
    scalarMultBase: (k) => {
      const kn = mod(k, ed25519_Point.Fn.ORDER);
      if (kn === _0n6)
        return _0n6;
      const p = ed25519_Point.BASE.multiply(kn);
      return mod((p.Z + p.Y) * powPminus2(mod(p.Z - p.Y, P)), P);
    }
  });
})();

// shared/backupValidation.mjs
var MAX_CIPHER_BYTES = 64 * 1024 * 1024;

// shared/crypto.mjs
var encoder = new TextEncoder();
var decoder = new TextDecoder();
async function createIdentityKeyPair() {
  const pair = x25519.keygen();
  return {
    publicKey: { key_ops: [], ext: true, crv: "X25519", x: toBase64Url(pair.publicKey), kty: "OKP" },
    privateKey: { key_ops: ["deriveBits"], ext: true, crv: "X25519", d: toBase64Url(pair.secretKey), x: toBase64Url(pair.publicKey), kty: "OKP" }
  };
}
async function encryptEnvelope(recipientPublicJwk, payload) {
  const ephemeral = x25519.keygen();
  const sharedSecret = x25519.getSharedSecret(ephemeral.secretKey, fromBase64Url(recipientPublicJwk.x));
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveMessageKey(sharedSecret, salt);
  const ephemeralPublicKey = { key_ops: [], ext: true, crv: "X25519", x: toBase64Url(ephemeral.publicKey), kty: "OKP" };
  const header = {
    version: 1,
    algorithm: "X25519-HKDF-SHA256-AES256GCM",
    ephemeralPublicKey,
    salt: toBase64(salt),
    nonce: toBase64(nonce)
  };
  const additionalData = encoder.encode(canonicalHeader(header));
  const plain = encoder.encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData, tagLength: 128 }, key, plain);
  zeroArray(new Uint8Array(sharedSecret));
  zeroArray(plain);
  return { cryptoHeader: header, cipherText: toBase64(new Uint8Array(cipher)) };
}
async function decryptEnvelope(recipientPrivateJwk, cryptoHeader, cipherText) {
  validateHeader(cryptoHeader);
  const sharedSecret = x25519.getSharedSecret(fromBase64Url(recipientPrivateJwk.d), fromBase64Url(cryptoHeader.ephemeralPublicKey.x));
  const salt = fromBase64(cryptoHeader.salt);
  const nonce = fromBase64(cryptoHeader.nonce);
  const key = await deriveMessageKey(sharedSecret, salt);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce, additionalData: encoder.encode(canonicalHeader(cryptoHeader)), tagLength: 128 }, key, fromBase64(cipherText));
  zeroArray(new Uint8Array(sharedSecret));
  return JSON.parse(decoder.decode(plain));
}
async function deriveMessageKey(sharedSecret, salt) {
  const material = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt, info: encoder.encode("clear-signal-envelope-v1") }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
function validateHeader(header) {
  if (!header || header.version !== 1 || header.algorithm !== "X25519-HKDF-SHA256-AES256GCM" || !header.ephemeralPublicKey || typeof header.salt !== "string" || typeof header.nonce !== "string") throw new Error("INVALID_ENVELOPE_HEADER");
}
function canonicalHeader(header) {
  return JSON.stringify({ algorithm: header.algorithm, ephemeralPublicKey: { crv: header.ephemeralPublicKey.crv, kty: header.ephemeralPublicKey.kty, x: header.ephemeralPublicKey.x }, nonce: header.nonce, salt: header.salt, version: header.version });
}
function toBase64(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  return btoa(binary);
}
function fromBase64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function toBase64Url(bytes) {
  return toBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function fromBase64Url(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  return fromBase64(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
}
function zeroArray(value) {
  value.fill(0);
}

// integrations/heming-agent/pairing.mjs
async function beginAgentPairing(transport, provider = "Custom") {
  const identityKeys = await createIdentityKeyPair();
  const proof = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const proofPrivateKey = await crypto.subtle.exportKey("jwk", proof.privateKey);
  const devicePublicKey = Buffer.from(await crypto.subtle.exportKey("spki", proof.publicKey)).toString("base64");
  const pairing = await transport.api("/api/v1/agents/pairings", { body: { provider, publicKey: identityKeys.publicKey, devicePublicKey } });
  return { ...pairing, privateKey: identityKeys.privateKey, proofPrivateKey, devicePublicKey };
}
async function pollAgentPairing(transport, pending, signal) {
  const result = await transport.api("/api/v1/agents/pairings/poll", { body: { deviceCode: pending.deviceCode }, signal });
  if (result.state !== "approved") return null;
  const session = await decryptEnvelope(pending.privateKey, result.credentials.cryptoHeader, result.credentials.cipherText);
  if (session.identity.publicKey.x !== pending.privateKey.x) throw Error("AGENT_PAIRING_KEY_MISMATCH");
  return {
    session: { ...session, privateKey: pending.privateKey },
    proofPrivateKey: pending.proofPrivateKey,
    devicePublicKey: pending.devicePublicKey,
    prekeys: {},
    inbound: {},
    outbound: {},
    processed: [],
    outbox: null,
    job: null
  };
}

// integrations/heming-agent/ensurePairing.mjs
async function ensureAgentPairing({ transport, store, provider, onQr, signal }) {
  if (store.read()?.session) return store.read();
  store.lock?.();
  try {
    if (store.read()?.session) return store.read();
    let pending = store.read()?.pending;
    if (!pending || Date.parse(pending.expiresAt) <= Date.now()) {
      pending = await beginAgentPairing(transport, provider);
      store.write({ pending });
    }
    await onQr({ qr: pending.qr, expiresAt: pending.expiresAt });
    while (!signal?.aborted && Date.now() < Date.parse(pending.expiresAt)) {
      const paired = await pollAgentPairing(transport, pending, signal);
      if (paired) {
        store.write(paired);
        return paired;
      }
      await delay(pending.intervalSeconds * 1e3, void 0, { signal });
    }
    throw Error("AGENT_PAIRING_EXPIRED");
  } finally {
    store.unlock?.();
  }
}

// integrations/heming-agent/connector.mjs
import { setTimeout as delay2 } from "node:timers/promises";

// shared/hemingEmojiCatalog.mjs
var ROWS = [
  [1, "OK", "\u786E\u8BA4"],
  [2, "THUMBSUP", "\u70B9\u8D5E"],
  [3, "THANKS", "\u611F\u8C22"],
  [4, "MUSCLE", "\u529B\u91CF"],
  [5, "FINGERHEART", "\u6BD4\u5FC3"],
  [6, "APPLAUSE", "\u638C\u58F0"],
  [7, "FISTBUMP", "\u78B0\u62F3"],
  [8, "JIAYI", "+1"],
  [9, "DONE", "\u5B8C\u6210"],
  [10, "SMILE", "\u5FAE\u7B11"],
  [11, "BLUSH", "\u8138\u7EA2"],
  [12, "LAUGH", "\u5927\u7B11"],
  [13, "SMIRK", "\u574F\u7B11"],
  [14, "LOL", "\u7B11\u54ED"],
  [15, "FACEPALM", "\u6342\u8138"],
  [16, "LOVE", "\u7231\u5FC3\u773C"],
  [17, "WINK", "\u7728\u773C"],
  [18, "PROUD", "\u9A84\u50B2"],
  [19, "WITTY", "\u673A\u7075"],
  [20, "SMART", "\u806A\u660E"],
  [21, "SCOWL", "\u76B1\u7709"],
  [22, "THINKING", "\u601D\u8003"],
  [23, "SOB", "\u75DB\u54ED"],
  [24, "CRY", "\u6D41\u6CEA"],
  [25, "ERROR", "\u51FA\u9519"],
  [26, "NOSEPICK", "\u62A0\u9F3B"],
  [27, "HAUGHTY", "\u50B2\u5A07"],
  [28, "SLAP", "\u62CD\u8138"],
  [29, "SPITBLOOD", "\u5410\u8840"],
  [30, "TOASTED", "\u7D2F\u574F\u4E86"],
  [31, "GLANCE", "\u659C\u773C\u770B"],
  [32, "DULL", "\u5446\u6EDE"],
  [33, "INNOCENTSMILE", "\u65E0\u8F9C\u7B11"],
  [34, "JOYFUL", "\u6B23\u559C"],
  [35, "WOW", "\u54C7"],
  [36, "TRICK", "\u8C03\u76AE"],
  [37, "YEAH", "\u8036"],
  [38, "ENOUGH", "\u591F\u4E86"],
  [39, "TEARS", "\u6CEA\u76EE"],
  [40, "EMBARRASSED", "\u5C34\u5C2C"],
  [41, "KISS", "\u4EB2\u4EB2"],
  [42, "SMOOCH", "\u98DE\u543B"],
  [43, "DROOL", "\u6D41\u53E3\u6C34"],
  [44, "OBSESSED", "\u7740\u8FF7"],
  [45, "MONEY", "\u8D22\u8FF7"],
  [46, "TEASE", "\u9017\u4F60"],
  [47, "SHOWOFF", "\u5F97\u610F"],
  [48, "COMFORT", "\u5B89\u6170"],
  [49, "CLAP", "\u62CD\u624B"],
  [50, "PRAISE", "\u8D5E\u8D4F"],
  [51, "STRIVE", "\u594B\u6597"],
  [52, "XBLUSH", "\u5BB3\u7F9E\u900F\u4E86"],
  [53, "SILENT", "\u4FDD\u6301\u5B89\u9759"],
  [54, "WAVE", "\u6325\u624B"],
  [55, "WHAT", "\u4EC0\u4E48"],
  [56, "FROWN", "\u96BE\u8FC7"],
  [57, "SHY", "\u7F9E\u6DA9"],
  [58, "DIZZY", "\u7729\u6655"],
  [59, "LOOKDOWN", "\u4F4E\u5934"],
  [60, "CHUCKLE", "\u5077\u7B11"],
  [61, "WAIL", "\u5927\u54ED"],
  [62, "CRAZY", "\u75AF\u72C2"],
  [63, "WHIMPER", "\u5C0F\u58F0\u54ED"],
  [64, "HUG", "\u62E5\u62B1"],
  [65, "BLUBBER", "\u54ED\u82B1\u4E86"],
  [66, "WRONGED", "\u59D4\u5C48"],
  [67, "HUSKY", "\u4E8C\u54C8"],
  [68, "SHHH", "\u5618"],
  [69, "SMUG", "\u5F97\u610F"],
  [70, "ANGRY", "\u751F\u6C14"],
  [71, "HAMMER", "\u5C0F\u9524"],
  [72, "SHOCKED", "\u9707\u60CA"],
  [73, "TERROR", "\u60CA\u6050"],
  [74, "PETRIFIED", "\u5413\u5446"],
  [75, "SKULL", "\u9AB7\u9AC5"],
  [76, "SWEAT", "\u6D41\u6C57"],
  [77, "SPEECHLESS", "\u65E0\u8BED"],
  [78, "SLEEP", "\u7761\u7740"],
  [79, "DROWSY", "\u56F0\u5026"],
  [80, "YAWN", "\u6253\u54C8\u6B20"],
  [81, "SICK", "\u751F\u75C5"],
  [82, "PUKE", "\u6076\u5FC3"],
  [83, "BETRAYED", "\u53D7\u4F24"],
  [84, "HEADSET", "\u6234\u8033\u9EA6"],
  [85, "EatingFood", "\u5403\u4E1C\u897F"],
  [86, "MeMeMe", "\u6211\u6765"],
  [87, "Sigh", "\u53F9\u6C14"],
  [88, "Typing", "\u8F93\u5165\u4E2D"],
  [89, "Lemon", "\u67E0\u6AAC"],
  [90, "Get", "\u61C2\u4E86"],
  [91, "LGTM", "\u6211\u770B\u884C"],
  [92, "OnIt", "\u5728\u505A\u4E86"],
  [93, "OneSecond", "\u7B49\u4E00\u4E0B"],
  [94, "VRHeadset", "VR \u5934\u663E"],
  [95, "YouAreTheBest", "\u4F60\u6700\u68D2"],
  [96, "SALUTE", "\u81F4\u656C"],
  [97, "SHAKE", "\u63E1\u624B"],
  [98, "HIGHFIVE", "\u51FB\u638C"],
  [99, "UPPERLEFT", "\u6307\u5411\u5DE6\u4E0A"],
  [100, "ThumbsDown", "\u70B9\u8E29"],
  [101, "SLIGHT", "\u6DE1\u6DE1\u4E00\u7B11"],
  [102, "TONGUE", "\u5410\u820C"],
  [103, "EYESCLOSED", "\u95ED\u773C"],
  [104, "RoarForYou", "\u4E3A\u4F60\u5450\u558A"],
  [105, "CALF", "\u5C0F\u725B"],
  [106, "BEAR", "\u5C0F\u718A"],
  [107, "BULL", "\u516C\u725B"],
  [108, "RAINBOWPUKE", "\u5F69\u8679\u5410\u5410"],
  [109, "ROSE", "\u73AB\u7470"],
  [110, "HEART", "\u7231\u5FC3"],
  [111, "PARTY", "\u6D3E\u5BF9"],
  [112, "LIPS", "\u4EB2\u543B"],
  [113, "BEER", "\u5E72\u676F"],
  [114, "CAKE", "\u86CB\u7CD5"],
  [115, "GIFT", "\u793C\u7269"],
  [116, "CUCUMBER", "\u9EC4\u74DC"],
  [117, "Drumstick", "\u9E21\u817F"],
  [118, "Pepper", "\u8FA3\u6912"],
  [119, "CANDIEDHAWS", "\u7CD6\u846B\u82A6"],
  [120, "BubbleTea", "\u5976\u8336"],
  [121, "Coffee", "\u5496\u5561"],
  [122, "Yes", "YES"],
  [123, "No", "NO"],
  [124, "OKR", "\u76EE\u6807"],
  [125, "CheckMark", "\u52FE\u9009"],
  [126, "CrossMark", "\u53C9\u53F7"],
  [127, "MinusOne", "-1"],
  [128, "Hundred", "100 \u5206"],
  [129, "AWESOMEN", "\u592A\u68D2\u4E86"],
  [130, "Pin", "\u5B9A\u4F4D"],
  [131, "Alarm", "\u95F9\u949F"],
  [132, "Loudspeaker", "\u5587\u53ED"],
  [133, "Trophy", "\u5956\u676F"],
  [134, "Fire", "\u706B\u7130"],
  [135, "BOMB", "\u70B8\u5F39"],
  [136, "Music", "\u97F3\u4E50"],
  [137, "XmasTree", "\u5723\u8BDE\u6811"],
  [138, "Snowman", "\u96EA\u4EBA"],
  [139, "XmasHat", "\u5723\u8BDE\u5E3D"],
  [140, "FIREWORKS", "\u70DF\u82B1"],
  [141, "2022", "2022"],
  [142, "REDPACKET", "\u7EA2\u5305"],
  [143, "FORTUNE", "\u798F\u6C14"],
  [144, "LUCK", "\u597D\u8FD0"],
  [145, "FIRECRACKER", "\u97AD\u70AE"],
  [146, "StickyRiceBalls", "\u6C64\u5706"],
  [147, "HEARTBROKEN", "\u5FC3\u788E"],
  [148, "POOP", "\u4FBF\u4FBF"],
  [149, "StatusFlashOfInspiration", "\u7075\u611F\u95EA\u73B0"],
  [150, "18X", "18+"],
  [151, "CLEAVER", "\u83DC\u5200"],
  [152, "Soccer", "\u8DB3\u7403"],
  [153, "Basketball", "\u7BEE\u7403"],
  [154, "GeneralDoNotDisturb", "\u514D\u6253\u6270"],
  [155, "Status_PrivateMessage", "\u79C1\u5BC6\u6D88\u606F"],
  [156, "GeneralInMeetingBusy", "\u4F1A\u8BAE\u4E2D"],
  [157, "StatusReading", "\u9605\u8BFB\u4E2D"],
  [158, "StatusInFlight", "\u98DE\u884C\u4E2D"],
  [159, "GeneralBusinessTrip", "\u51FA\u5DEE"],
  [160, "GeneralWorkFromHome", "\u5C45\u5BB6\u529E\u516C"],
  [161, "StatusEnjoyLife", "\u4EAB\u53D7\u751F\u6D3B"],
  [162, "GeneralTravellingCar", "\u81EA\u9A7E\u9014\u4E2D"],
  [163, "StatusBus", "\u516C\u4EA4\u9014\u4E2D"],
  [164, "GeneralSun", "\u592A\u9633"],
  [165, "GeneralMoonRest", "\u6708\u4EAE\u4F11\u606F"],
  [166, "MoonRabbit", "\u7389\u5154"],
  [167, "Mooncake", "\u6708\u997C"],
  [168, "JubilantRabbit", "\u6B22\u5E86\u5154"],
  [169, "TV", "\u7535\u89C6"],
  [170, "Movie", "\u7535\u5F71"],
  [171, "Pumpkin", "\u5357\u74DC"],
  [172, "BeamingFace", "\u707F\u70C2\u7B11\u8138"],
  [173, "Delighted", "\u6B23\u559C"],
  [174, "ColdSweat", "\u51B7\u6C57"],
  [175, "FullMoonFace", "\u6EE1\u6708\u7B11\u8138"],
  [176, "Partying", "\u5E86\u795D"],
  [177, "GoGoGo", "\u51B2\u5440"],
  [178, "ThanksFace", "\u611F\u8C22\u8138"],
  [179, "SaluteFace", "\u656C\u793C\u8138"],
  [180, "Shrug", "\u644A\u624B"],
  [181, "ClownFace", "\u5C0F\u4E11\u8138"],
  [182, "HappyDragon", "\u5F00\u5FC3\u9F99"]
];
var MERGE_IDS = /* @__PURE__ */ new Set([6, 33, 42, 47, 50, 52, 61, 63, 65, 74, 95, 172, 173, 178, 179]);
var MOVE_IDS = /* @__PURE__ */ new Set([149, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 168, 182]);
var REMOVE_IDS = /* @__PURE__ */ new Set([28, 29, 108, 135, 141, 150, 151]);
var HEMING_EMOJIS = Object.freeze(ROWS.map(([id, code, label]) => Object.freeze({
  id,
  code,
  label,
  decision: REMOVE_IDS.has(id) ? "removed" : MOVE_IDS.has(id) ? "status-or-seasonal" : MERGE_IDS.has(id) ? "merged" : "active"
})));
var CHAT_EMOJIS = Object.freeze(HEMING_EMOJIS.filter((item) => item.decision === "active"));
var STATUS_EMOJIS = Object.freeze(HEMING_EMOJIS.filter((item) => item.id === 149 || item.id >= 154 && item.id <= 165));
var SEASONAL_EMOJIS = Object.freeze(HEMING_EMOJIS.filter((item) => item.id === 168 || item.id === 182));
var RESPONSE_IDS = /* @__PURE__ */ new Set([
  1,
  2,
  3,
  4,
  5,
  7,
  8,
  9,
  49,
  51,
  54,
  86,
  90,
  91,
  92,
  93,
  96,
  97,
  98,
  99,
  100,
  122,
  123,
  124,
  125,
  126,
  127,
  128,
  129
]);
var EMOTION_IDS = /* @__PURE__ */ new Set([
  ...Array.from({ length: 74 }, (_, offset) => offset + 10),
  101,
  102,
  103,
  104,
  172,
  173,
  174,
  175,
  176,
  177,
  178,
  179,
  180,
  181
]);
var CHAT_EMOJI_GROUPS = Object.freeze([
  { id: "response", label: "\u5E38\u7528\u56DE\u5E94", items: CHAT_EMOJIS.filter((item) => RESPONSE_IDS.has(item.id)) },
  { id: "emotion", label: "\u60C5\u7EEA", items: CHAT_EMOJIS.filter((item) => EMOTION_IDS.has(item.id) && !RESPONSE_IDS.has(item.id)) },
  { id: "other", label: "\u751F\u6D3B\u4E0E\u8282\u5E86", items: CHAT_EMOJIS.filter((item) => !RESPONSE_IDS.has(item.id) && !EMOTION_IDS.has(item.id)) }
]);
var BY_ID = new Map(HEMING_EMOJIS.map((item) => [item.id, item]));
var BY_ACTIVE_LABEL = new Map(CHAT_EMOJIS.map((item) => [item.label, item]));
var hemingEmojiById = (id) => BY_ID.get(Number(id)) || null;
var emojiToken = (item) => `\uFF3B\u548C\u9E23\xB7${String(item.id).padStart(3, "0")}\xB7${item.label}\uFF3D`;
var DEFAULT_CURATED_RECENT = Object.freeze([10, 14, 2, 3, 1, 35, 110, 111].map((id) => emojiToken(hemingEmojiById(id))));
function emojiFromToken(value) {
  const match = /^［和鸣·(\d{3})·[^］]{1,24}］$/.exec(String(value || ""));
  return match ? hemingEmojiById(Number(match[1])) : null;
}

// shared/chatEventPayloads.mjs
var MAX_ATTACHMENTS_PER_MESSAGE = 9;
var EPHEMERAL_TTL_SECONDS = Object.freeze([
  5,
  10,
  30,
  60,
  300,
  3600,
  86400
]);
function requiredString(value, name, maximum = 4096) {
  if (typeof value !== "string" || !value.trim() || value.length > maximum)
    throw new Error(`INVALID_${name}`);
  return value;
}
function normalizeIsoTimestamp(value, name) {
  const timestamp = requiredString(String(value || ""), name, 64);
  if (!Number.isFinite(Date.parse(timestamp))) throw new Error(`INVALID_${name}`);
  return timestamp;
}
function normalizeMessageIds(value) {
  if (!Array.isArray(value) || !value.length || value.length > 200)
    throw new Error("INVALID_MESSAGE_IDS");
  return [
    ...new Set(
      value.map((item) => requiredString(String(item), "MESSAGE_ID", 128))
    )
  ];
}
function normalizeIdentityIds(value) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > 200)
    throw new Error("INVALID_IDENTITY_IDS");
  const ids = value.map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id < 1))
    throw new Error("INVALID_IDENTITY_IDS");
  return [...new Set(ids)];
}
function normalizeAttachmentCore(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID_ATTACHMENT");
  const attachment = {
    id: requiredString(String(value.id || ""), "ATTACHMENT_ID", 128),
    version: value.version,
    algorithm: requiredString(value.algorithm, "ATTACHMENT_ALGORITHM", 64),
    key: requiredString(value.key, "ATTACHMENT_KEY", 128),
    nonce: String(value.nonce || "").slice(0, 64),
    noncePrefix: String(value.noncePrefix || "").slice(0, 64),
    digest: requiredString(value.digest, "ATTACHMENT_DIGEST", 128).toLowerCase(),
    plainBytes: Number(value.plainBytes),
    cipherBytes: Number(value.cipherBytes),
    fileName: String(value.fileName || "\u52A0\u5BC6\u9644\u4EF6").slice(0, 240),
    mimeType: String(value.mimeType || "application/octet-stream").slice(0, 128),
    durationMs: Number(value.durationMs || 0)
  };
  const commonInvalid = !/^[a-f0-9]{64}$/.test(attachment.digest) || !Number.isInteger(attachment.plainBytes) || attachment.plainBytes < 1 || !Number.isInteger(attachment.cipherBytes) || attachment.cipherBytes < 17 || !Number.isFinite(attachment.durationMs) || attachment.durationMs < 0;
  if (commonInvalid)
    throw new Error("INVALID_ATTACHMENT");
  if (attachment.version === 1 && attachment.algorithm === "AES-256-GCM" && attachment.nonce) {
    delete attachment.noncePrefix;
    return attachment;
  }
  if (attachment.version !== 2 || attachment.algorithm !== "AES-256-GCM-CHUNKED" || !attachment.noncePrefix || !Number.isInteger(value.chunkBytes) || value.chunkBytes < 256 * 1024 || value.chunkBytes > 4 * 1024 * 1024 || !Number.isInteger(value.chunkCount) || value.chunkCount < 1 || value.chunkCount > 400 || !Array.isArray(value.chunks) || value.chunks.length !== value.chunkCount)
    throw new Error("INVALID_ATTACHMENT");
  attachment.chunkBytes = value.chunkBytes;
  attachment.chunkCount = value.chunkCount;
  attachment.chunks = value.chunks.map((chunk, index) => {
    const normalized = {
      index: Number(chunk?.index),
      plainBytes: Number(chunk?.plainBytes),
      cipherBytes: Number(chunk?.cipherBytes),
      digest: String(chunk?.digest || "").toLowerCase()
    };
    if (normalized.index !== index || !Number.isInteger(normalized.plainBytes) || normalized.plainBytes < 1 || !Number.isInteger(normalized.cipherBytes) || normalized.cipherBytes !== normalized.plainBytes + 16 || !/^[a-f0-9]{64}$/.test(normalized.digest))
      throw new Error("INVALID_ATTACHMENT");
    return normalized;
  });
  if (attachment.chunkCount !== Math.ceil(attachment.plainBytes / attachment.chunkBytes) || attachment.cipherBytes !== attachment.plainBytes + attachment.chunkCount * 16 || attachment.chunks.some((chunk, index) => {
    const expected = index === attachment.chunkCount - 1 ? attachment.plainBytes - index * attachment.chunkBytes : attachment.chunkBytes;
    return chunk.plainBytes !== expected;
  }))
    throw new Error("INVALID_ATTACHMENT");
  delete attachment.nonce;
  return attachment;
}
function normalizeAttachment(value) {
  const attachment = normalizeAttachmentCore(value);
  if (value.originalAttachment != null) {
    const originalAttachment = normalizeAttachmentCore(value.originalAttachment);
    if (!originalAttachment.mimeType.startsWith("image/"))
      throw new Error("INVALID_ORIGINAL_ATTACHMENT");
    attachment.originalAttachment = originalAttachment;
  }
  return attachment;
}
function normalizeMessageAttachments(data, contentType) {
  const supplied = Array.isArray(data.attachments) ? data.attachments : data.attachment ? [data.attachment] : [];
  if (!supplied.length || supplied.length > MAX_ATTACHMENTS_PER_MESSAGE || contentType === "voice" && supplied.length !== 1)
    throw new Error("INVALID_ATTACHMENTS");
  const attachments = supplied.map(normalizeAttachment);
  if (contentType === "media" && attachments.some(
    (attachment) => !attachment.mimeType.startsWith("image/") && !attachment.mimeType.startsWith("video/")
  ))
    throw new Error("INVALID_MEDIA_ATTACHMENT");
  if (contentType === "image" && attachments.some((attachment) => !attachment.mimeType.startsWith("image/")))
    throw new Error("INVALID_IMAGE_ATTACHMENT");
  if (contentType === "video" && attachments.some((attachment) => !attachment.mimeType.startsWith("video/")))
    throw new Error("INVALID_VIDEO_ATTACHMENT");
  if (contentType === "voice" && attachments.some((attachment) => !attachment.mimeType.startsWith("audio/")))
    throw new Error("INVALID_VOICE_ATTACHMENT");
  if (contentType === "voice" && attachments.some(
    (attachment) => attachment.durationMs < 500 || attachment.durationMs > 6e4
  ))
    throw new Error("INVALID_VOICE_DURATION");
  return attachments;
}
function isSingleEmoji(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 32)
    return false;
  const custom = emojiFromToken(value);
  if (custom) return emojiToken(custom) === value;
  const containsEmoji = new RegExp("\\p{Extended_Pictographic}|\\p{Regional_Indicator}|[#*0-9]\\uFE0F?\\u20E3", "u").test(
    value
  );
  if (!containsEmoji) return false;
  if (typeof Intl?.Segmenter !== "function") return true;
  const segments = [
    ...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(value)
  ];
  return segments.length === 1;
}
function normalizeReactionData(data) {
  const operation = data.operation == null || data.operation === "" ? "add" : String(data.operation);
  if (!isSingleEmoji(data.emoji)) throw new Error("INVALID_REACTION");
  if (!(/* @__PURE__ */ new Set(["add", "remove"])).has(operation))
    throw new Error("INVALID_REACTION_OPERATION");
  return {
    targetMessageId: requiredString(
      String(data.targetMessageId || ""),
      "TARGET_MESSAGE_ID",
      128
    ),
    emoji: data.emoji,
    operation
  };
}
function normalizeEphemeralMetadata(value) {
  if (!value) return null;
  if (typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID_EPHEMERAL_METADATA");
  const ttlSeconds = Number(value.ttlSeconds);
  if (!EPHEMERAL_TTL_SECONDS.includes(ttlSeconds))
    throw new Error("INVALID_EPHEMERAL_TTL");
  return { mode: "after-read", ttlSeconds };
}
function normalizeEphemeralStartData(data) {
  const startedAt = normalizeIsoTimestamp(data.startedAt, "EPHEMERAL_STARTED_AT");
  const expiresAt = normalizeIsoTimestamp(data.expiresAt, "EPHEMERAL_EXPIRES_AT");
  if (Date.parse(expiresAt) <= Date.parse(startedAt))
    throw new Error("INVALID_EPHEMERAL_EXPIRY");
  const viewerIdentityId = Number(data.viewerIdentityId || 0);
  if (!Number.isInteger(viewerIdentityId) || viewerIdentityId < 1)
    throw new Error("INVALID_EPHEMERAL_VIEWER");
  return {
    targetMessageId: requiredString(
      String(data.targetMessageId || ""),
      "TARGET_MESSAGE_ID",
      128
    ),
    viewerIdentityId,
    startedAt,
    expiresAt
  };
}
function normalizeMessageDestroyData(data) {
  const scope = data.scope === "all" ? "all" : "identity";
  const viewerIdentityId = Number(data.viewerIdentityId || 0);
  if (scope === "identity" && !Number.isInteger(viewerIdentityId))
    throw new Error("INVALID_DESTROY_VIEWER");
  if (scope === "identity" && viewerIdentityId < 1)
    throw new Error("INVALID_DESTROY_VIEWER");
  const reason = String(data.reason || "expired");
  if (!["expired", "security-policy"].includes(reason))
    throw new Error("INVALID_DESTROY_REASON");
  return {
    targetMessageId: requiredString(
      String(data.targetMessageId || ""),
      "TARGET_MESSAGE_ID",
      128
    ),
    scope,
    viewerIdentityId: scope === "identity" ? viewerIdentityId : 0,
    destroyedAt: normalizeIsoTimestamp(data.destroyedAt, "DESTROYED_AT"),
    reason
  };
}

// shared/chatRecordPayload.mjs
var CHAT_RECORD_VERSION = 1;
var MAX_CHAT_RECORD_ITEMS = 30;
var MAX_CHAT_RECORD_ATTACHMENTS = 45;
var MAX_CHAT_RECORD_BYTES = 96 * 1024;
var ITEM_TYPES = /* @__PURE__ */ new Set(["text", "location", "poll", "attachment", "media"]);
function optionalText(value, maximum) {
  return String(value || "").trim().slice(0, maximum);
}
function normalizeLocation(value) {
  const latitude = Number(value?.latitude);
  const longitude = Number(value?.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("INVALID_CHAT_RECORD_LOCATION");
  return {
    latitude,
    longitude,
    label: requiredString(String(value?.label || "\u5171\u4EAB\u4F4D\u7F6E"), "CHAT_RECORD_LOCATION", 160)
  };
}
function normalizePoll(value) {
  const options = Array.isArray(value?.options) ? value.options.slice(0, 12).map(
    (option2) => requiredString(
      typeof option2 === "string" ? option2 : option2?.text,
      "CHAT_RECORD_POLL_OPTION",
      160
    )
  ) : [];
  if (options.length < 2) throw new Error("INVALID_CHAT_RECORD_POLL_OPTIONS");
  return {
    question: requiredString(value?.question, "CHAT_RECORD_POLL_QUESTION", 240),
    options,
    multiple: Boolean(value?.multiple)
  };
}
function normalizeItem(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID_CHAT_RECORD_ITEM");
  const type = String(value.type || "");
  if (!ITEM_TYPES.has(type)) throw new Error("INVALID_CHAT_RECORD_ITEM_TYPE");
  const item = {
    sourceMessageId: requiredString(
      String(value.sourceMessageId || ""),
      "CHAT_RECORD_SOURCE_MESSAGE_ID",
      128
    ),
    senderName: requiredString(value.senderName, "CHAT_RECORD_SENDER", 80),
    sentAt: normalizeIsoTimestamp(value.sentAt, "CHAT_RECORD_SENT_AT"),
    type
  };
  if (type === "text")
    item.text = requiredString(value.text, "CHAT_RECORD_TEXT", 1200);
  if (type === "location") item.location = normalizeLocation(value.location);
  if (type === "poll") item.poll = normalizePoll(value.poll);
  if (type === "attachment" || type === "media") {
    item.attachments = normalizeMessageAttachments(
      { attachments: value.attachments },
      type === "media" ? "media" : "file"
    );
    item.text = optionalText(value.text, 240);
  }
  return item;
}
function byteLength(value) {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}
function normalizeChatRecordPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID_CHAT_RECORD");
  if (value.version !== CHAT_RECORD_VERSION)
    throw new Error("UNSUPPORTED_CHAT_RECORD_VERSION");
  if (!Array.isArray(value.items) || !value.items.length || value.items.length > MAX_CHAT_RECORD_ITEMS)
    throw new Error("INVALID_CHAT_RECORD_ITEMS");
  const normalized = {
    version: CHAT_RECORD_VERSION,
    title: requiredString(value.title, "CHAT_RECORD_TITLE", 120),
    items: value.items.map(normalizeItem)
  };
  const attachmentCount = normalized.items.reduce(
    (total, item) => total + (item.attachments?.length || 0),
    0
  );
  if (attachmentCount > MAX_CHAT_RECORD_ATTACHMENTS)
    throw new Error("CHAT_RECORD_ATTACHMENT_LIMIT_EXCEEDED");
  if (byteLength(normalized) > MAX_CHAT_RECORD_BYTES)
    throw new Error("CHAT_RECORD_SIZE_LIMIT_EXCEEDED");
  return normalized;
}

// shared/agentReplyState.mjs
var STATES = /* @__PURE__ */ new Set(["working", "generating", "completed", "failed", "stopped"]);
function normalizeAgentReply(value) {
  if (!value || typeof value !== "object" || !STATES.has(value.state) || !Number.isSafeInteger(value.revision) || value.revision < 0 || value.revision > 1e5 || typeof value.requestMessageId !== "string" || !value.requestMessageId || value.requestMessageId.length > 128)
    throw Error("INVALID_AGENT_REPLY");
  return { state: value.state, revision: value.revision, requestMessageId: value.requestMessageId };
}

// shared/agentInteraction.mjs
var APPROVAL_ACTIONS = Object.freeze({ once: "\u5141\u8BB8\u4E00\u6B21", session: "\u672C\u6B21\u4F1A\u8BDD\u5141\u8BB8", always: "\u59CB\u7EC8\u5141\u8BB8", deny: "\u62D2\u7EDD" });
var STATES2 = /* @__PURE__ */ new Set(["pending", "approved", "denied", "expired", "closed", "failed"]);
var token = (value) => typeof value === "string" && value.length > 0 && value.length <= 128;
function normalizeAgentInteraction(value) {
  if (!value || value.version !== 1 || value.kind !== "approval" || !token(value.id) || !token(value.requestMessageId) || !token(value.ownerIdentityId) || !STATES2.has(value.status) || !Number.isSafeInteger(value.revision) || value.revision < 0 || value.revision > 1e5 || typeof value.command !== "string" || !value.command.trim() || value.command.length > 6e3 || typeof value.reason !== "string" || value.reason.length > 2e3 || !Array.isArray(value.actions) || !value.actions.length || value.actions.length > 4 || value.actions.some((action) => !Object.hasOwn(APPROVAL_ACTIONS, action)) || new Set(value.actions).size !== value.actions.length || !value.actions.includes("deny") || typeof value.expiresAt !== "string" || !Number.isFinite(Date.parse(value.expiresAt)) || value.choice !== void 0 && !value.actions.includes(value.choice)) throw Error("INVALID_AGENT_INTERACTION");
  return {
    version: 1,
    kind: "approval",
    id: value.id,
    requestMessageId: value.requestMessageId,
    ownerIdentityId: value.ownerIdentityId,
    command: value.command,
    reason: value.reason,
    actions: [...value.actions],
    expiresAt: new Date(value.expiresAt).toISOString(),
    status: value.status,
    revision: value.revision,
    ...value.choice ? { choice: value.choice } : {}
  };
}
function normalizeAgentAction(data) {
  if (!data || !token(data.interactionId) || !token(data.requestMessageId) || !token(data.targetMessageId) || !Object.hasOwn(APPROVAL_ACTIONS, data.action)) throw Error("INVALID_AGENT_ACTION");
  return {
    interactionId: data.interactionId,
    requestMessageId: data.requestMessageId,
    targetMessageId: data.targetMessageId,
    action: data.action
  };
}
function mergeAgentInteraction(message, event, actorIdentityId) {
  const previous = message.agentInteraction, next = event.data.agentInteraction;
  if (!previous || !next || message.deleted || message.recalled || message.destroyed || String(message.senderIdentityId) !== String(actorIdentityId) || previous.status !== "pending" || next.revision <= previous.revision || next.status === "pending") return message;
  for (const key of ["id", "requestMessageId", "ownerIdentityId", "command", "reason", "expiresAt"])
    if (previous[key] !== next[key]) return message;
  if (JSON.stringify(previous.actions) !== JSON.stringify(next.actions)) return message;
  return { ...message, text: event.data.text, agentInteraction: next };
}
function approvalStatusLabel(status) {
  return { pending: "\u7B49\u5F85\u4F60\u7684\u6279\u51C6", approved: "\u5DF2\u5141\u8BB8", denied: "\u5DF2\u62D2\u7EDD", expired: "\u6279\u51C6\u8BF7\u6C42\u5DF2\u8FC7\u671F", closed: "\u8BF7\u6C42\u5DF2\u7ED3\u675F", failed: "\u6279\u51C6\u8BF7\u6C42\u672A\u5B8C\u6210" }[status] || "\u8BF7\u6C42\u4E0D\u53EF\u7528";
}

// shared/groupEvents.mjs
var GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);
var GROUP_STATE_ACTIONS = Object.freeze([
  "members-added",
  "history-shared",
  "member-removed",
  "admin-set",
  "admin-unset",
  "owner-transferred",
  "member-left",
  "dissolved"
]);
function keyVersion(value) {
  const version = Number(value || 1);
  if (!Number.isInteger(version) || version < 1)
    throw new Error("INVALID_GROUP_KEY_VERSION");
  return version;
}
function boundedText(value, maximum, error) {
  const text = String(value || "").trim();
  if (text.length > maximum) throw new Error(error);
  return text;
}
function groupAvatar(value) {
  const avatar = String(value || "");
  if (!avatar) return "";
  if (avatar.length > 16e4 || !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(avatar))
    throw new Error("INVALID_GROUP_AVATAR");
  return avatar;
}
function normalizeGroupProfileData(value) {
  return {
    name: requiredString(value?.name, "GROUP_NAME", 128),
    avatar: groupAvatar(value?.avatar),
    announcement: boundedText(value?.announcement, 2e3, "INVALID_GROUP_ANNOUNCEMENT"),
    keyVersion: keyVersion(value?.keyVersion)
  };
}
function normalizeGroupMemberProfileData(value) {
  return {
    nickname: boundedText(value?.nickname, 64, "INVALID_GROUP_NICKNAME"),
    keyVersion: keyVersion(value?.keyVersion)
  };
}
function normalizeGroupStateData(value) {
  const action = requiredString(value?.action, "GROUP_ACTION", 32);
  if (!GROUP_STATE_ACTIONS.includes(action))
    throw new Error("INVALID_GROUP_ACTION");
  const targetIdentityId = Number(value?.targetIdentityId || 0);
  if (!Number.isInteger(targetIdentityId) || targetIdentityId < 0)
    throw new Error("INVALID_GROUP_TARGET");
  return {
    action,
    keyVersion: keyVersion(value?.keyVersion),
    actorIdentityId: Math.max(0, Number(value?.actorIdentityId) || 0),
    targetIdentityId,
    targetIdentityIds: normalizeIdentityIds(value?.targetIdentityIds)
  };
}
function normalizeGroupSyncRequestData(value) {
  return { keyVersion: keyVersion(value?.keyVersion) };
}
function normalizeGroupPinData(value) {
  const action = requiredString(value?.action, "GROUP_PIN_ACTION", 16);
  if (!["pin", "unpin"].includes(action))
    throw new Error("INVALID_GROUP_PIN_ACTION");
  return {
    action,
    messageId: requiredString(
      String(value?.messageId || ""),
      "GROUP_PIN_MESSAGE_ID",
      128
    ),
    keyVersion: keyVersion(value?.keyVersion)
  };
}

// shared/chatEvents.mjs
var CHAT_EVENT_PROTOCOL = "clear-signal.chat-event";
var CHAT_EVENT_VERSION = 1;
var MESSAGE_MUTATION_WINDOW_MS = 6 * 60 * 60 * 1e3;
var EVENT_TYPES = /* @__PURE__ */ new Set([
  "agent.action",
  "agent.reply",
  "message.create",
  "message.edit",
  "message.delete",
  "message.remove",
  "conversation.settings",
  "conversation.read-marker",
  "contact.settings",
  "message.reaction",
  "message.ephemeral.start",
  "message.destroy",
  "receipt.delivered",
  "receipt.read",
  "typing",
  "poll.vote",
  "call.offer",
  "call.answer",
  "call.ice",
  "call.end",
  "group.profile",
  "group.member-profile",
  "group.state",
  "group.sync-request",
  "group.pin",
  "group.sender-key"
]);
function eventId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function validateData(type, value) {
  const data = value && typeof value === "object" && !Array.isArray(value) ? structuredClone(value) : {};
  if (type === "message.create") {
    data.messageId = requiredString(
      String(data.messageId || ""),
      "MESSAGE_ID",
      128
    );
    data.contentType ||= "text";
    if (![
      "text",
      "image",
      "video",
      "voice",
      "file",
      "media",
      "location",
      "contact-card",
      "poll",
      "call",
      "chat-record"
    ].includes(data.contentType))
      throw new Error("INVALID_CONTENT_TYPE");
    if (data.contentType === "text")
      data.text = requiredString(data.text, "MESSAGE_TEXT", 16384);
    else if (["image", "video", "voice", "file", "media"].includes(data.contentType)) {
      data.attachments = normalizeMessageAttachments(data, data.contentType);
      data.attachment = data.attachments[0];
      if (data.contentType === "voice") {
        data.voice = { durationMs: data.attachment.durationMs };
        data.text = "";
      } else
        data.text = String(
          data.text || (data.attachments.length === 1 ? data.attachment.fileName : "")
        ).slice(0, 240);
    } else if (data.contentType === "location") {
      const latitude = Number(data.location?.latitude);
      const longitude = Number(data.location?.longitude);
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180)
        throw new Error("INVALID_LOCATION");
      data.location = {
        latitude,
        longitude,
        accuracy: Number(data.location.accuracy || 0),
        label: String(data.location.label || "\u5171\u4EAB\u4F4D\u7F6E").slice(0, 160),
        ...typeof data.location.address === "string" && data.location.address.trim() ? { address: data.location.address.trim().slice(0, 300) } : {}
      };
      data.text = data.location.label;
    } else if (data.contentType === "contact-card") {
      const identityId = Number(data.contactCard?.identityId || 0);
      if (!Number.isInteger(identityId) || identityId < 1)
        throw new Error("INVALID_CONTACT_CARD_IDENTITY");
      data.contactCard = {
        identityId,
        commId: requiredString(
          String(data.contactCard?.commId || ""),
          "CONTACT_CARD_COMM_ID",
          32
        ),
        displayName: requiredString(
          String(data.contactCard?.displayName || ""),
          "CONTACT_CARD_DISPLAY_NAME",
          64
        )
      };
      data.text = `[\u8054\u7CFB\u4EBA\u540D\u7247] ${data.contactCard.displayName}`;
    } else if (data.contentType === "poll") {
      const options = Array.isArray(data.poll?.options) ? data.poll.options.slice(0, 12).map((option2) => ({
        id: requiredString(
          String(option2.id || ""),
          "POLL_OPTION_ID",
          128
        ),
        text: requiredString(option2.text, "POLL_OPTION", 160)
      })) : [];
      if (options.length < 2) throw new Error("INVALID_POLL_OPTIONS");
      data.poll = {
        pollId: requiredString(String(data.poll?.pollId || ""), "POLL_ID", 128),
        question: requiredString(data.poll?.question, "POLL_QUESTION", 240),
        options,
        multiple: Boolean(data.poll?.multiple)
      };
      data.text = data.poll.question;
    } else if (data.contentType === "call") {
      const call = data.call;
      if (!call || typeof call !== "object")
        throw new Error("INVALID_CALL_RECORD");
      const outcome = String(call.outcome || "completed");
      if (!["completed", "cancelled", "declined", "missed", "failed"].includes(
        outcome
      ))
        throw new Error("INVALID_CALL_OUTCOME");
      data.call = {
        callId: requiredString(String(call.callId || ""), "CALL_ID", 128),
        video: Boolean(call.video),
        outgoing: Boolean(call.outgoing),
        outcome,
        durationSeconds: Math.max(
          0,
          Math.min(86400, Math.round(Number(call.durationSeconds || 0)))
        )
      };
    } else if (data.contentType === "chat-record") {
      data.chatRecord = normalizeChatRecordPayload(data.chatRecord);
      data.text = `[\u804A\u5929\u8BB0\u5F55] ${data.chatRecord.title} \xB7 ${data.chatRecord.items.length} \u6761`;
    }
    if (data.replyTo) {
      data.replyTo = {
        messageId: requiredString(
          String(data.replyTo.messageId || ""),
          "REPLY_MESSAGE_ID",
          128
        ),
        preview: String(data.replyTo.preview || "").slice(0, 160)
      };
    }
    if (data.forwardedFrom) {
      data.forwardedFrom = {
        messageId: String(data.forwardedFrom.messageId || "").slice(0, 128),
        senderCommId: String(data.forwardedFrom.senderCommId || "").slice(
          0,
          32
        )
      };
    }
    data.mentionIdentityIds = normalizeIdentityIds(data.mentionIdentityIds);
    const ephemeral = normalizeEphemeralMetadata(data.ephemeral);
    if (ephemeral && !["text", "image", "video", "voice", "media"].includes(data.contentType))
      throw new Error("EPHEMERAL_CONTENT_TYPE_NOT_SUPPORTED");
    if (ephemeral) data.ephemeral = ephemeral;
    else delete data.ephemeral;
    if (data.whisper === true) data.whisper = true;
    else delete data.whisper;
    if (data.agentReply) data.agentReply = normalizeAgentReply(data.agentReply);
    if (data.agentInteraction) {
      if (data.contentType !== "text" || data.forwardedFrom || data.whisper || data.ephemeral || data.agentReply) throw Error("INVALID_AGENT_INTERACTION_MESSAGE");
      data.agentInteraction = normalizeAgentInteraction(data.agentInteraction);
    }
  } else if (type === "agent.action") {
    return normalizeAgentAction(data);
  } else if (type === "agent.reply") {
    data.targetMessageId = requiredString(String(data.targetMessageId || ""), "TARGET_MESSAGE_ID", 128);
    data.agentReply = normalizeAgentReply(data.agentReply);
    if (typeof data.text !== "string" || data.text.length > 16384) throw Error("INVALID_AGENT_REPLY_TEXT");
  } else if (type === "conversation.settings") {
    const mute = data.mute && typeof data.mute === "object" ? data.mute : null;
    data.pinned = Boolean(data.pinned);
    data.archived = Boolean(data.archived);
    data.private = Boolean(data.private);
    if (Object.hasOwn(data, "showMemberNames"))
      data.showMemberNames = data.showMemberNames !== false;
    data.mute = mute ? {
      until: mute.until == null ? null : normalizeIsoTimestamp(mute.until, "MUTE_UNTIL"),
      messages: mute.messages !== false,
      calls: mute.calls !== false,
      mentions: mute.mentions !== false
    } : null;
  } else if (type === "conversation.read-marker") {
    data.messageId = requiredString(
      String(data.messageId || ""),
      "READ_MARKER_MESSAGE_ID",
      128
    );
    data.readThroughAt = normalizeIsoTimestamp(
      data.readThroughAt,
      "READ_MARKER_TIMESTAMP"
    );
  } else if (type === "contact.settings") {
    data.identityId = Number(data.identityId || 0);
    if (!Number.isInteger(data.identityId) || data.identityId < 1)
      throw new Error("INVALID_CONTACT_IDENTITY");
    data.alias = String(data.alias || "").slice(0, 64);
    data.tags = [...new Set((Array.isArray(data.tags) ? data.tags : []).map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 12);
    data.favorite = Boolean(data.favorite);
    data.blocked = Boolean(data.blocked);
    data.hidden = Boolean(data.hidden);
    data.clearHistory = Boolean(data.clearHistory);
    if (Object.hasOwn(data, "visibilityChanged"))
      data.visibilityChanged = Boolean(data.visibilityChanged);
  } else if (type === "message.edit") {
    data.targetMessageId = requiredString(
      String(data.targetMessageId || ""),
      "TARGET_MESSAGE_ID",
      128
    );
    data.text = requiredString(data.text, "MESSAGE_TEXT", 16384);
    if (data.agentInteraction) data.agentInteraction = normalizeAgentInteraction(data.agentInteraction);
  } else if (type === "message.delete" || type === "message.remove") {
    data.targetMessageId = requiredString(
      String(data.targetMessageId || ""),
      "TARGET_MESSAGE_ID",
      128
    );
  } else if (type === "message.reaction") {
    return normalizeReactionData(data);
  } else if (type === "message.ephemeral.start") {
    return normalizeEphemeralStartData(data);
  } else if (type === "message.destroy") {
    return normalizeMessageDestroyData(data);
  } else if (type === "receipt.delivered" || type === "receipt.read") {
    data.messageIds = normalizeMessageIds(data.messageIds);
  } else if (type === "typing") {
    data.active = Boolean(data.active);
  } else if (type === "poll.vote") {
    data.pollId = requiredString(String(data.pollId || ""), "POLL_ID", 128);
    data.optionIds = normalizeMessageIds(data.optionIds);
  } else if (type === "call.offer" || type === "call.answer") {
    data.callId = requiredString(String(data.callId || ""), "CALL_ID", 128);
    data.targetIdentityId = Number(data.targetIdentityId || 0);
    data.sourceDeviceId = requiredString(
      String(data.sourceDeviceId || ""),
      "SOURCE_DEVICE_ID",
      128
    );
    data.targetDeviceId = String(data.targetDeviceId || "").slice(0, 128);
    data.sdp = requiredString(data.sdp, "CALL_SDP", 131072);
    data.video = Boolean(data.video);
    data.group = Boolean(data.group);
    if (type === "call.offer") data.restart = Boolean(data.restart);
    else delete data.restart;
  } else if (type === "call.ice") {
    data.callId = requiredString(String(data.callId || ""), "CALL_ID", 128);
    data.targetIdentityId = Number(data.targetIdentityId || 0);
    data.sourceDeviceId = requiredString(
      String(data.sourceDeviceId || ""),
      "SOURCE_DEVICE_ID",
      128
    );
    data.targetDeviceId = String(data.targetDeviceId || "").slice(0, 128);
    data.candidate = requiredString(data.candidate, "ICE_CANDIDATE", 8192);
    data.sdpMid = String(data.sdpMid || "").slice(0, 128);
    data.sdpMLineIndex = Number(data.sdpMLineIndex || 0);
  } else if (type === "call.end") {
    data.callId = requiredString(String(data.callId || ""), "CALL_ID", 128);
    data.targetIdentityId = Number(data.targetIdentityId || 0);
    data.sourceDeviceId = requiredString(
      String(data.sourceDeviceId || ""),
      "SOURCE_DEVICE_ID",
      128
    );
    data.targetDeviceId = String(data.targetDeviceId || "").slice(0, 128);
    data.reason = String(data.reason || "ended").slice(0, 32);
  } else if (type === "group.profile") {
    return normalizeGroupProfileData(data);
  } else if (type === "group.member-profile") {
    return normalizeGroupMemberProfileData(data);
  } else if (type === "group.state") {
    return normalizeGroupStateData(data);
  } else if (type === "group.sync-request") {
    return normalizeGroupSyncRequestData(data);
  } else if (type === "group.pin") {
    return normalizeGroupPinData(data);
  } else if (type === "group.sender-key") {
    data.keyId = requiredString(String(data.keyId || ""), "GROUP_KEY_ID", 128);
    data.epoch = Number(data.epoch || 0);
    data.nextIteration = Number(data.nextIteration || 0);
    data.senderIdentityId = Number(data.senderIdentityId || 0);
    data.senderDeviceId = requiredString(
      String(data.senderDeviceId || ""),
      "GROUP_KEY_SENDER_DEVICE_ID",
      128
    );
    if (!Number.isInteger(data.epoch) || data.epoch < 1 || !Number.isInteger(data.nextIteration) || data.nextIteration < 0 || !Number.isInteger(data.senderIdentityId) || data.senderIdentityId < 1 || typeof data.chainKey !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(data.chainKey))
      throw new Error("INVALID_GROUP_SENDER_KEY_DISTRIBUTION");
  }
  return data;
}
function createChatEvent(type, data, options = {}) {
  if (!EVENT_TYPES.has(type)) throw new Error("INVALID_CHAT_EVENT_TYPE");
  return {
    protocol: CHAT_EVENT_PROTOCOL,
    version: CHAT_EVENT_VERSION,
    eventId: requiredString(
      String(options.eventId || eventId()),
      "EVENT_ID",
      128
    ),
    type,
    sentAt: normalizeIsoTimestamp(
      options.sentAt || (/* @__PURE__ */ new Date()).toISOString(),
      "EVENT_SENT_AT"
    ),
    data: validateData(type, data)
  };
}
function normalizeChatEvent(payload, fallback = {}) {
  if (payload?.protocol === CHAT_EVENT_PROTOCOL) {
    if (payload.version !== CHAT_EVENT_VERSION)
      throw new Error("UNSUPPORTED_CHAT_EVENT_VERSION");
    return createChatEvent(payload.type, payload.data, {
      eventId: payload.eventId,
      sentAt: payload.sentAt
    });
  }
  if (payload?.type === "text" && typeof payload.text === "string") {
    return createChatEvent(
      "message.create",
      {
        messageId: String(
          payload.clientMessageId || fallback.clientMessageId || eventId()
        ),
        contentType: "text",
        text: payload.text
      },
      {
        eventId: String(
          payload.clientMessageId || fallback.clientMessageId || eventId()
        ),
        sentAt: payload.sentAt || fallback.createdAt
      }
    );
  }
  throw new Error("INVALID_CHAT_EVENT");
}
function chatEventEnvelopeKind(type, data = {}) {
  if (type.startsWith("receipt.")) return "receipt";
  if (type === "typing") return "typing";
  if (type === "message.create") return "message";
  if (type.startsWith("group.")) return "group-control";
  if (type === "call.offer") return "call-offer";
  if (type === "call.end")
    return data.reason === "answered-on-device" ? "call-answered" : "call-end";
  if (type.startsWith("call.")) return "call-signal";
  return "control";
}

// shared/chatEventBatch.mjs
var CHAT_EVENT_BATCH_PROTOCOL = "clear-signal.chat-event-batch";
var CHAT_EVENT_BATCH_VERSION = 1;
var MAX_CHAT_EVENTS_PER_BATCH = 100;
function generatedBatchId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `batch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function createChatEventBatch(events, options = {}) {
  if (!Array.isArray(events) || !events.length || events.length > MAX_CHAT_EVENTS_PER_BATCH)
    throw new Error("INVALID_CHAT_EVENT_BATCH");
  const normalized = events.map((event) => normalizeChatEvent(event));
  if (new Set(normalized.map((event) => event.eventId)).size !== normalized.length)
    throw new Error("DUPLICATE_CHAT_EVENT_ID");
  return {
    protocol: CHAT_EVENT_BATCH_PROTOCOL,
    version: CHAT_EVENT_BATCH_VERSION,
    batchId: requiredString(
      String(options.batchId || generatedBatchId()),
      "BATCH_ID",
      128
    ),
    sentAt: normalizeIsoTimestamp(
      options.sentAt || (/* @__PURE__ */ new Date()).toISOString(),
      "BATCH_SENT_AT"
    ),
    events: normalized
  };
}
function normalizeChatEventBatch(payload) {
  if (payload?.protocol !== CHAT_EVENT_BATCH_PROTOCOL)
    throw new Error("INVALID_CHAT_EVENT_BATCH");
  if (payload.version !== CHAT_EVENT_BATCH_VERSION)
    throw new Error("UNSUPPORTED_CHAT_EVENT_BATCH_VERSION");
  return createChatEventBatch(payload.events, {
    batchId: payload.batchId,
    sentAt: payload.sentAt
  });
}
function normalizeChatPayload(payload, fallback = {}) {
  if (payload?.protocol === CHAT_EVENT_BATCH_PROTOCOL)
    return normalizeChatEventBatch(payload).events;
  return [normalizeChatEvent(payload, fallback)];
}

// shared/sseEventStream.mjs
function streamError(code, cause) {
  const error = new Error(code, cause ? { cause } : void 0);
  error.code = code;
  return error;
}
async function listenToSse({
  url,
  token: token2,
  onEvent,
  signal,
  connectTimeoutMs = 12e3,
  idleTimeoutMs = 45e3,
  fetchImpl = globalThis.fetch
}) {
  const controller2 = new AbortController();
  let timeoutCode = "";
  const abort = () => controller2.abort(signal?.reason);
  signal?.addEventListener("abort", abort, { once: true });
  let timer = setTimeout(() => {
    timeoutCode = "EVENT_STREAM_CONNECT_TIMEOUT";
    controller2.abort(streamError(timeoutCode));
  }, connectTimeoutMs);
  let reader;
  try {
    const response = await fetchImpl(url, {
      headers: { "x-device-token": token2 },
      signal: controller2.signal
    });
    if (!response.ok || !response.body?.getReader)
      throw streamError("EVENT_STREAM_UNAVAILABLE");
    clearTimeout(timer);
    const armIdleTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timeoutCode = "EVENT_STREAM_IDLE_TIMEOUT";
        controller2.abort(streamError(timeoutCode));
      }, idleTimeoutMs);
    };
    armIdleTimer();
    reader = response.body.getReader();
    const decoder3 = new TextDecoder();
    let buffer = "";
    while (!controller2.signal.aborted) {
      const { value, done } = await reader.read();
      if (done) break;
      armIdleTimer();
      buffer += decoder3.decode(value, { stream: true }).replaceAll("\r\n", "\n");
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";
      for (const chunk of chunks) {
        const data = chunk.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
        if (data) await onEvent(JSON.parse(data));
      }
    }
    if (!signal?.aborted) throw streamError("EVENT_STREAM_CLOSED");
  } catch (error) {
    if (signal?.aborted) return;
    if (timeoutCode) throw streamError(timeoutCode, error);
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
    await reader?.cancel().catch(() => {
    });
  }
}

// shared/prekeys.mjs
function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function prekeySigningMessage(deviceId, prekeyId, publicKey) {
  return `clear-signal-device-prekey-v1
${deviceId}
${prekeyId}
${publicKey.x}`;
}
async function createSignedPrekeys(deviceId, count, sign) {
  const bundles = [];
  const privateKeys = {};
  for (let index = 0; index < count; index += 1) {
    const id = crypto.randomUUID();
    const pair = await createIdentityKeyPair();
    const signature = await sign(prekeySigningMessage(deviceId, id, pair.publicKey));
    bundles.push({ id, publicKey: pair.publicKey, signature });
    privateKeys[id] = { privateKey: pair.privateKey, publicKey: pair.publicKey, signature, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  }
  return { bundles, privateKeys };
}
function derToP1363(signature, size = 32) {
  if (signature.length === size * 2) return signature;
  if (signature[0] !== 48) throw new Error("INVALID_ECDSA_SIGNATURE");
  let offset = 2;
  if (signature[1] & 128) offset = 2 + (signature[1] & 127);
  if (signature[offset] !== 2) throw new Error("INVALID_ECDSA_SIGNATURE");
  const rLength = signature[offset + 1];
  const r = signature.slice(offset + 2, offset + 2 + rLength);
  offset += 2 + rLength;
  if (signature[offset] !== 2) throw new Error("INVALID_ECDSA_SIGNATURE");
  const sLength = signature[offset + 1];
  const s = signature.slice(offset + 2, offset + 2 + sLength);
  const output = new Uint8Array(size * 2);
  output.set(r.slice(Math.max(0, r.length - size)), size - Math.min(size, r.length));
  output.set(s.slice(Math.max(0, s.length - size)), size * 2 - Math.min(size, s.length));
  return output;
}
async function verifySignedPrekey(target) {
  if (!target?.prekey || typeof target.deviceProofPublicKey !== "string") return false;
  try {
    const key = await crypto.subtle.importKey("spki", base64ToBytes(target.deviceProofPublicKey), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    const signature = derToP1363(base64ToBytes(target.prekey.signature));
    return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, signature, new TextEncoder().encode(prekeySigningMessage(target.deviceId, target.prekey.id, target.prekey.publicKey)));
  } catch {
    return false;
  }
}

// shared/sessionRatchet.mjs
var ALGORITHM = "CLEAR-SIGNAL-RATCHET-AES256GCM-V1";
var MAX_SKIPPED_KEYS = 100;
var encoder2 = new TextEncoder();
var decoder2 = new TextDecoder();
function toBase642(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
}
function fromBase642(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function toBase64Url2(bytes) {
  return toBase642(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function fromBase64Url2(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  return fromBase642(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
}
async function initialChainKey(sharedSecret, salt, sessionId) {
  const material = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveBits"]
  );
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt,
        info: encoder2.encode(`clear-signal-ratchet-root-v1
${sessionId}`)
      },
      material,
      256
    )
  );
}
async function hmac(keyBytes, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder2.encode(value)));
}
async function deriveStep(chainKey, counter) {
  const [messageKey, nextChainKey] = await Promise.all([
    hmac(chainKey, `message
${counter}`),
    hmac(chainKey, `chain
${counter}`)
  ]);
  return { messageKey, nextChainKey };
}
function canonicalHeader2(header) {
  return JSON.stringify({
    algorithm: header.algorithm,
    counter: header.counter,
    nonce: header.nonce,
    salt: header.salt,
    senderRatchetPublicKey: {
      crv: header.senderRatchetPublicKey.crv,
      kty: header.senderRatchetPublicKey.kty,
      x: header.senderRatchetPublicKey.x
    },
    sessionId: header.sessionId,
    version: header.version
  });
}
function validateHeader2(header) {
  if (header?.version !== 3 || header.algorithm !== ALGORITHM || typeof header.sessionId !== "string" || !header.sessionId || !Number.isInteger(header.counter) || header.counter < 0 || header.counter > Number.MAX_SAFE_INTEGER || header.senderRatchetPublicKey?.kty !== "OKP" || header.senderRatchetPublicKey?.crv !== "X25519" || typeof header.senderRatchetPublicKey?.x !== "string" || typeof header.salt !== "string" || typeof header.nonce !== "string")
    throw new Error("INVALID_RATCHET_HEADER");
}
function publicJwk(bytes) {
  return {
    key_ops: [],
    ext: true,
    crv: "X25519",
    x: toBase64Url2(bytes),
    kty: "OKP"
  };
}
async function createOutboundRatchetSession(recipientPublicJwk, metadata = {}) {
  if (recipientPublicJwk?.kty !== "OKP" || recipientPublicJwk.crv !== "X25519")
    throw new Error("INVALID_RATCHET_RECIPIENT_KEY");
  const pair = x25519.keygen();
  const sharedSecret = x25519.getSharedSecret(
    pair.secretKey,
    fromBase64Url2(recipientPublicJwk.x)
  );
  const sessionId = crypto.randomUUID();
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const chainKey = await initialChainKey(sharedSecret, salt, sessionId);
  sharedSecret.fill(0);
  return {
    version: 1,
    direction: "outbound",
    sessionId,
    chainKey: toBase642(chainKey),
    nextCounter: 0,
    senderRatchetPrivateKey: toBase64Url2(pair.secretKey),
    senderRatchetPublicKey: publicJwk(pair.publicKey),
    salt: toBase642(salt),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    ...metadata
  };
}
async function createInboundRatchetSession(recipientPrivateJwk, header, metadata = {}) {
  validateHeader2(header);
  if (recipientPrivateJwk?.kty !== "OKP" || recipientPrivateJwk.crv !== "X25519")
    throw new Error("INVALID_RATCHET_RECIPIENT_KEY");
  const sharedSecret = x25519.getSharedSecret(
    fromBase64Url2(recipientPrivateJwk.d),
    fromBase64Url2(header.senderRatchetPublicKey.x)
  );
  const chainKey = await initialChainKey(
    sharedSecret,
    fromBase642(header.salt),
    header.sessionId
  );
  sharedSecret.fill(0);
  return {
    version: 1,
    direction: "inbound",
    sessionId: header.sessionId,
    chainKey: toBase642(chainKey),
    nextCounter: 0,
    senderRatchetPublicKey: header.senderRatchetPublicKey,
    salt: header.salt,
    skippedKeys: {},
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    ...metadata
  };
}
async function encryptRatchetEnvelope(state, payload) {
  if (state?.direction !== "outbound" || !Number.isInteger(state.nextCounter))
    throw new Error("INVALID_OUTBOUND_RATCHET_STATE");
  const counter = state.nextCounter;
  const { messageKey, nextChainKey } = await deriveStep(
    fromBase642(state.chainKey),
    counter
  );
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const header = {
    version: 3,
    algorithm: ALGORITHM,
    sessionId: state.sessionId,
    counter,
    senderRatchetPublicKey: state.senderRatchetPublicKey,
    salt: state.salt,
    nonce: toBase642(nonce)
  };
  const key = await crypto.subtle.importKey(
    "raw",
    messageKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const plain = encoder2.encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      additionalData: encoder2.encode(canonicalHeader2(header)),
      tagLength: 128
    },
    key,
    plain
  );
  plain.fill(0);
  messageKey.fill(0);
  return {
    encrypted: {
      cryptoHeader: header,
      cipherText: toBase642(new Uint8Array(cipher))
    },
    state: {
      ...state,
      chainKey: toBase642(nextChainKey),
      nextCounter: counter + 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
async function decryptRatchetEnvelope(state, cryptoHeader, cipherText) {
  validateHeader2(cryptoHeader);
  if (state?.direction !== "inbound" || state.sessionId !== cryptoHeader.sessionId || state.senderRatchetPublicKey?.x !== cryptoHeader.senderRatchetPublicKey.x || state.salt !== cryptoHeader.salt)
    throw new Error("RATCHET_SESSION_MISMATCH");
  const counter = cryptoHeader.counter;
  let chainKey = fromBase642(state.chainKey);
  let nextCounter = state.nextCounter;
  const skippedKeys = { ...state.skippedKeys || {} };
  let messageKey;
  if (counter < nextCounter) {
    if (!skippedKeys[counter]) throw new Error("RATCHET_MESSAGE_REPLAYED");
    messageKey = fromBase642(skippedKeys[counter]);
    delete skippedKeys[counter];
  } else {
    if (counter - nextCounter > MAX_SKIPPED_KEYS)
      throw new Error("RATCHET_COUNTER_GAP_TOO_LARGE");
    while (nextCounter <= counter) {
      const step = await deriveStep(chainKey, nextCounter);
      chainKey.fill(0);
      chainKey = step.nextChainKey;
      if (nextCounter === counter) messageKey = step.messageKey;
      else skippedKeys[nextCounter] = toBase642(step.messageKey);
      nextCounter += 1;
    }
  }
  const key = await crypto.subtle.importKey(
    "raw",
    messageKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const plain = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: fromBase642(cryptoHeader.nonce),
      additionalData: encoder2.encode(canonicalHeader2(cryptoHeader)),
      tagLength: 128
    },
    key,
    fromBase642(cipherText)
  );
  messageKey.fill(0);
  const retainedSkippedKeys = Object.fromEntries(
    Object.entries(skippedKeys).sort(([left], [right]) => Number(left) - Number(right)).slice(-MAX_SKIPPED_KEYS)
  );
  return {
    payload: JSON.parse(decoder2.decode(plain)),
    state: {
      ...state,
      chainKey: toBase642(chainKey),
      nextCounter,
      skippedKeys: retainedSkippedKeys,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function isRatchetEnvelopeHeader(header) {
  return header?.version === 3 && header.algorithm === ALGORITHM;
}

// shared/identityBoundEnvelope.mjs
var VERSION = 1;
var ALGORITHM2 = "X25519-HKDF-SHA256-HMAC-SHA256";
var encoder3 = new TextEncoder();
function toBase643(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
}
function fromBase643(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function fromBase64Url3(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  return fromBase643(value.replaceAll("-", "+").replaceAll("_", "/") + padding);
}
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, canonicalize(value[key])])
  );
}
function unsignedHeader(cryptoHeader) {
  const header = structuredClone(cryptoHeader);
  delete header.authentication;
  delete header.identityBinding;
  return header;
}
async function bindingKey(privateJwk, publicJwk2, salt) {
  if (privateJwk?.kty !== "OKP" || privateJwk.crv !== "X25519" || publicJwk2?.kty !== "OKP" || publicJwk2.crv !== "X25519")
    throw new Error("INVALID_IDENTITY_BINDING_KEY");
  const sharedSecret = x25519.getSharedSecret(
    fromBase64Url3(privateJwk.d),
    fromBase64Url3(publicJwk2.x)
  );
  const material = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info: encoder3.encode("clear-signal-identity-envelope-binding-v1")
    },
    material,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign", "verify"]
  );
  sharedSecret.fill(0);
  return key;
}
function bindingMessage(encrypted, context, senderDeviceProofPublicKey) {
  return encoder3.encode(
    JSON.stringify(
      canonicalize({
        cipherText: encrypted.cipherText,
        context,
        cryptoHeader: unsignedHeader(encrypted.cryptoHeader),
        senderDeviceProofPublicKey
      })
    )
  );
}
async function bindEncryptedEnvelopeToIdentity({
  encrypted,
  context,
  senderIdentityPrivateKey,
  recipientIdentityPublicKey,
  senderDeviceProofPublicKey
}) {
  if (!encrypted?.cryptoHeader || typeof encrypted.cipherText !== "string")
    throw new Error("INVALID_IDENTITY_BINDING_INPUT");
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await bindingKey(
    senderIdentityPrivateKey,
    recipientIdentityPublicKey,
    salt
  );
  const tag = await crypto.subtle.sign(
    "HMAC",
    key,
    bindingMessage(encrypted, context, senderDeviceProofPublicKey)
  );
  return {
    ...encrypted,
    cryptoHeader: {
      ...encrypted.cryptoHeader,
      identityBinding: {
        version: VERSION,
        algorithm: ALGORITHM2,
        salt: toBase643(salt),
        tag: toBase643(new Uint8Array(tag))
      }
    }
  };
}
async function verifyEncryptedEnvelopeIdentityBinding({
  cryptoHeader,
  cipherText,
  context,
  recipientIdentityPrivateKey,
  senderIdentityPublicKey,
  senderDeviceProofPublicKey
}) {
  const binding = cryptoHeader?.identityBinding;
  if (!binding) return { identityBound: false, legacy: true };
  if (binding.version !== VERSION || binding.algorithm !== ALGORITHM2 || typeof binding.salt !== "string" || typeof binding.tag !== "string")
    throw new Error("INVALID_IDENTITY_BINDING");
  try {
    const key = await bindingKey(
      recipientIdentityPrivateKey,
      senderIdentityPublicKey,
      fromBase643(binding.salt)
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase643(binding.tag),
      bindingMessage(
        { cryptoHeader, cipherText },
        context,
        senderDeviceProofPublicKey
      )
    );
    if (!valid) throw new Error("IDENTITY_BINDING_INVALID");
  } catch (error) {
    if (error?.message === "IDENTITY_BINDING_INVALID") throw error;
    throw new Error("INVALID_IDENTITY_BINDING");
  }
  return { identityBound: true, legacy: false };
}

// shared/authenticatedEnvelope.mjs
var AUTH_VERSION = 1;
var AUTH_ALGORITHM = "ECDSA-P256-SHA256";
var AUTH_DOMAIN = "clear-signal-authenticated-envelope-v1";
var encoder4 = new TextEncoder();
function toBase644(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
}
function fromBase644(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function canonicalize2(value) {
  if (Array.isArray(value)) return value.map(canonicalize2);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, canonicalize2(value[key])])
  );
}
function canonicalContext(value) {
  const context = {
    conversationId: String(value?.conversationId || ""),
    clientMessageId: String(value?.clientMessageId || ""),
    senderIdentityId: Number(value?.senderIdentityId || 0),
    senderDeviceId: String(value?.senderDeviceId || ""),
    recipientIdentityId: Number(value?.recipientIdentityId || 0),
    recipientDeviceId: String(value?.recipientDeviceId || "")
  };
  if (!context.conversationId || !context.clientMessageId || !Number.isInteger(context.senderIdentityId) || context.senderIdentityId < 1 || !context.senderDeviceId || !Number.isInteger(context.recipientIdentityId) || context.recipientIdentityId < 1)
    throw new Error("INVALID_ENVELOPE_AUTH_CONTEXT");
  return context;
}
async function sha256Base64(value) {
  return toBase644(
    new Uint8Array(await crypto.subtle.digest("SHA-256", encoder4.encode(value)))
  );
}
async function signingChallenge(cryptoHeader, cipherText, context, publicKey) {
  const unsignedHeader2 = structuredClone(cryptoHeader);
  delete unsignedHeader2.authentication;
  const digest = await sha256Base64(
    JSON.stringify(
      canonicalize2({
        cryptoHeader: unsignedHeader2,
        cipherText,
        context,
        senderDeviceProofPublicKey: publicKey
      })
    )
  );
  return `${AUTH_DOMAIN}
${digest}`;
}
function derToP13632(signature, size = 32) {
  if (signature.length === size * 2) return signature;
  if (signature[0] !== 48) throw new Error("INVALID_ECDSA_SIGNATURE");
  let offset = 2;
  if (signature[1] & 128) offset = 2 + (signature[1] & 127);
  if (signature[offset] !== 2) throw new Error("INVALID_ECDSA_SIGNATURE");
  const rLength = signature[offset + 1];
  const r = signature.slice(offset + 2, offset + 2 + rLength);
  offset += 2 + rLength;
  if (signature[offset] !== 2) throw new Error("INVALID_ECDSA_SIGNATURE");
  const sLength = signature[offset + 1];
  const s = signature.slice(offset + 2, offset + 2 + sLength);
  const output = new Uint8Array(size * 2);
  output.set(r.slice(Math.max(0, r.length - size)), size - Math.min(size, r.length));
  output.set(
    s.slice(Math.max(0, s.length - size)),
    size * 2 - Math.min(size, s.length)
  );
  return output;
}
async function authenticateEncryptedEnvelope({
  encrypted,
  context,
  senderDeviceProofPublicKey,
  sign
}) {
  if (!encrypted?.cryptoHeader || typeof encrypted.cipherText !== "string" || typeof senderDeviceProofPublicKey !== "string" || !senderDeviceProofPublicKey || typeof sign !== "function")
    throw new Error("INVALID_ENVELOPE_AUTH_INPUT");
  const normalizedContext = canonicalContext(context);
  const challenge = await signingChallenge(
    encrypted.cryptoHeader,
    encrypted.cipherText,
    normalizedContext,
    senderDeviceProofPublicKey
  );
  const signature = await sign(challenge);
  if (typeof signature !== "string" || !signature)
    throw new Error("INVALID_ENVELOPE_AUTH_SIGNATURE");
  return {
    ...encrypted,
    cryptoHeader: {
      ...encrypted.cryptoHeader,
      authentication: {
        version: AUTH_VERSION,
        algorithm: AUTH_ALGORITHM,
        context: normalizedContext,
        senderDeviceProofPublicKey,
        signature
      }
    }
  };
}
async function verifyEncryptedEnvelopeAuthentication({
  cryptoHeader,
  cipherText,
  expectedContext
}) {
  const authentication = cryptoHeader?.authentication;
  if (!authentication) return { authenticated: false, legacy: true };
  if (authentication.version !== AUTH_VERSION || authentication.algorithm !== AUTH_ALGORITHM || typeof authentication.senderDeviceProofPublicKey !== "string" || typeof authentication.signature !== "string")
    throw new Error("INVALID_ENVELOPE_AUTHENTICATION");
  const context = canonicalContext(authentication.context);
  const expected = canonicalContext(expectedContext);
  if (JSON.stringify(context) !== JSON.stringify(expected))
    throw new Error("ENVELOPE_AUTH_CONTEXT_MISMATCH");
  try {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      fromBase644(authentication.senderDeviceProofPublicKey),
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["verify"]
    );
    const challenge = await signingChallenge(
      cryptoHeader,
      cipherText,
      context,
      authentication.senderDeviceProofPublicKey
    );
    const valid = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      publicKey,
      derToP13632(fromBase644(authentication.signature)),
      encoder4.encode(challenge)
    );
    if (!valid) throw new Error("ENVELOPE_AUTH_SIGNATURE_INVALID");
  } catch (error) {
    if (error?.message === "ENVELOPE_AUTH_SIGNATURE_INVALID") throw error;
    throw new Error("INVALID_ENVELOPE_AUTHENTICATION");
  }
  return {
    authenticated: true,
    legacy: false,
    context,
    senderDeviceProofPublicKey: authentication.senderDeviceProofPublicKey
  };
}

// shared/multiDeviceEnvelope.mjs
var BUNDLE_ALGORITHM = "CLEAR-SIGNAL-MULTI-DEVICE-BUNDLE-V1";
function toBase645(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  return btoa(binary);
}
function fromBase645(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function packMultiDeviceEnvelopes(packets) {
  if (!Array.isArray(packets) || !packets.length || packets.length > 64) throw new Error("INVALID_DEVICE_ENVELOPE_PACKETS");
  const normalized = packets.map((packet) => {
    if (typeof packet.deviceId !== "string" || !packet.encrypted?.cryptoHeader || typeof packet.encrypted.cipherText !== "string") throw new Error("INVALID_DEVICE_ENVELOPE_PACKET");
    return { deviceId: packet.deviceId, cryptoHeader: packet.encrypted.cryptoHeader, cipherText: packet.encrypted.cipherText };
  });
  return {
    cryptoHeader: { version: 2, algorithm: BUNDLE_ALGORITHM, deviceIds: normalized.map((packet) => packet.deviceId) },
    cipherText: toBase645(new TextEncoder().encode(JSON.stringify({ version: 1, packets: normalized })))
  };
}
function unpackMultiDeviceEnvelope(cryptoHeader, cipherText, deviceId) {
  if (cryptoHeader?.algorithm !== BUNDLE_ALGORITHM) return { cryptoHeader, cipherText };
  if (cryptoHeader.version !== 2 || !Array.isArray(cryptoHeader.deviceIds) || !cryptoHeader.deviceIds.includes(deviceId)) throw new Error("DEVICE_ENVELOPE_NOT_FOUND");
  const bundle = JSON.parse(new TextDecoder().decode(fromBase645(cipherText)));
  const packet = bundle?.version === 1 ? bundle.packets?.find((item) => item.deviceId === deviceId) : null;
  if (!packet?.cryptoHeader || typeof packet.cipherText !== "string") throw new Error("INVALID_DEVICE_ENVELOPE_BUNDLE");
  return { cryptoHeader: packet.cryptoHeader, cipherText: packet.cipherText };
}

// shared/unreadBadgeProtocol.mjs
var HASH_PATTERN = /^[a-f0-9]{64}$/;
var MAX_TOKENS = 100;
function unreadMessageToken(conversationId, actorIdentityId, messageId) {
  const actor = Number(actorIdentityId);
  if (!Number.isSafeInteger(actor) || actor < 0) throw Error("INVALID_UNREAD_MESSAGE_ACTOR");
  const conversation = String(conversationId ?? "");
  const message = String(messageId ?? "");
  if (!conversation || !message) throw Error("INVALID_UNREAD_MESSAGE_ID");
  return bytesToHex(sha256(utf8ToBytes(JSON.stringify([
    "heming-unread-v1",
    conversation,
    actor,
    message
  ]))));
}
function validateUnreadHint(value) {
  if (value === void 0) return void 0;
  if (!value || typeof value !== "object" || Array.isArray(value) || value.version !== 1 || Object.keys(value).length !== 3 || Object.keys(value).some((key) => !["version", "add", "remove"].includes(key)))
    throw Error("INVALID_UNREAD_HINT");
  for (const tokens of [value.add, value.remove]) {
    if (!Array.isArray(tokens) || tokens.length > MAX_TOKENS || new Set(tokens).size !== tokens.length) throw Error("INVALID_UNREAD_HINT");
    for (const token2 of tokens)
      if (typeof token2 !== "string" || !HASH_PATTERN.test(token2)) throw Error("INVALID_UNREAD_HINT");
  }
  if (value.add.some((token2) => value.remove.includes(token2))) throw Error("INVALID_UNREAD_HINT");
  return { version: 1, add: [...value.add], remove: [...value.remove] };
}
function unreadHintForPayload(conversationId, actorIdentityId, payload) {
  const batch = payload?.protocol === "clear-signal.chat-event-batch";
  const events = batch ? payload.events : [payload];
  if (!Array.isArray(events) || events.length > MAX_TOKENS) throw Error("INVALID_UNREAD_HINT");
  const add = /* @__PURE__ */ new Set(), remove = /* @__PURE__ */ new Set();
  for (const event of events) {
    if (event?.type === "message.create") {
      const token2 = unreadMessageToken(conversationId, actorIdentityId, event.data?.messageId);
      remove.delete(token2);
      add.add(token2);
    } else if (event?.type === "message.delete") {
      const token2 = unreadMessageToken(conversationId, actorIdentityId, event.data?.targetMessageId);
      add.delete(token2);
      remove.add(token2);
    }
  }
  if (!batch && !add.size && !remove.size) return void 0;
  return validateUnreadHint({ version: 1, add: [...add], remove: [...remove] });
}

// integrations/heming-agent/secureChannel.mjs
function createSecureAgentChannel({ transport, state, persist }) {
  const { session } = state;
  const sign = async (value) => {
    const key = await crypto.subtle.importKey("jwk", state.proofPrivateKey, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    return Buffer.from(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(value))).toString("base64");
  };
  const request = (path, options = {}) => transport.api(path, { token: session.token, ...options });
  async function ensurePrekeys() {
    const records = state.prekeys || {};
    if (Object.keys(records).length) {
      const synced = await request("/api/v1/devices/current/prekeys", { body: { prekeys: Object.entries(records).map(([id, record]) => ({ id, publicKey: record.publicKey, signature: record.signature })), cryptoVersion: 3 } });
      if (synced.available >= 12) return;
    }
    const generated = await createSignedPrekeys(session.deviceId, 24, sign);
    state.prekeys = { ...records, ...generated.privateKeys };
    persist();
    await request("/api/v1/devices/current/prekeys", { body: { prekeys: generated.bundles, cryptoVersion: 3 } });
  }
  async function flushOutbox() {
    if (!state.outbox) return;
    await request(`/api/v1/conversations/${session.conversationId}/envelopes`, { body: state.outbox });
    state.outbox = null;
    persist();
  }
  async function send(event) {
    const unread = unreadHintForPayload(session.conversationId, session.identity.identityId, event);
    await flushOutbox();
    const { targets } = await request(`/api/v1/conversations/${session.conversationId}/prekeys?targetIdentityId=${session.ownerIdentityId}`, {
      body: { establishedDeviceIds: Object.values(state.outbound).map((item) => item.recipientDeviceId) }
    });
    if (!targets.length) throw Error("AGENT_OWNER_DEVICE_UNAVAILABLE");
    const packets = [], changes = {};
    let migration = false;
    for (const target of targets) {
      if (Number(target.recipientIdentityId) !== session.ownerIdentityId) throw Error("AGENT_RECIPIENT_MISMATCH");
      if (session.ownerPublicKey && target.legacyPublicKey?.x !== session.ownerPublicKey.x) throw Error("AGENT_OWNER_KEY_CHANGED");
      if (target.prekey && !await verifySignedPrekey(target)) throw Error("DEVICE_PREKEY_SIGNATURE_INVALID");
      const context = {
        conversationId: session.conversationId,
        clientMessageId: event.eventId,
        senderIdentityId: session.identity.identityId,
        senderDeviceId: session.deviceId,
        recipientIdentityId: session.ownerIdentityId,
        recipientDeviceId: target.deviceId
      };
      let encrypted2;
      if (target.cryptoVersion >= 3 && (target.prekey || target.sessionEstablished)) {
        let ratchet = state.outbound[target.deviceId];
        if (!target.sessionEstablished || !ratchet) {
          if (!target.prekey) throw Error("RATCHET_PREKEY_REQUIRED");
          ratchet = await createOutboundRatchetSession(target.prekey.publicKey, {
            conversationId: session.conversationId,
            recipientIdentityId: session.ownerIdentityId,
            recipientDeviceId: target.deviceId,
            prekeyId: target.prekey.id
          });
        }
        const result = await encryptRatchetEnvelope(ratchet, event);
        changes[target.deviceId] = result.state;
        encrypted2 = result.encrypted;
        encrypted2.cryptoHeader = { ...encrypted2.cryptoHeader, prekeyId: ratchet.prekeyId, forwardSecrecy: "session-ratchet-v1", recipientDeviceId: target.deviceId };
      } else {
        migration = true;
      }
      if (encrypted2) {
        encrypted2 = await bindEncryptedEnvelopeToIdentity({
          encrypted: encrypted2,
          context,
          senderIdentityPrivateKey: session.privateKey,
          recipientIdentityPublicKey: target.legacyPublicKey,
          senderDeviceProofPublicKey: state.devicePublicKey
        });
        encrypted2 = await authenticateEncryptedEnvelope({ encrypted: encrypted2, context, senderDeviceProofPublicKey: state.devicePublicKey, sign });
        packets.push({ deviceId: target.deviceId, encrypted: encrypted2 });
      }
    }
    let encrypted;
    if (migration) {
      const target = targets[0];
      encrypted = await encryptEnvelope(target.legacyPublicKey, event);
      encrypted.cryptoHeader.migrationMode = "identity-key-v1";
      const context = {
        conversationId: session.conversationId,
        clientMessageId: event.eventId,
        senderIdentityId: session.identity.identityId,
        senderDeviceId: session.deviceId,
        recipientIdentityId: session.ownerIdentityId,
        recipientDeviceId: ""
      };
      encrypted = await bindEncryptedEnvelopeToIdentity({
        encrypted,
        context,
        senderIdentityPrivateKey: session.privateKey,
        recipientIdentityPublicKey: target.legacyPublicKey,
        senderDeviceProofPublicKey: state.devicePublicKey
      });
      encrypted = await authenticateEncryptedEnvelope({ encrypted, context, senderDeviceProofPublicKey: state.devicePublicKey, sign });
    } else encrypted = packMultiDeviceEnvelopes(packets);
    if (!migration) Object.assign(state.outbound, changes);
    state.outbox = {
      clientMessageId: event.eventId,
      kind: chatEventEnvelopeKind(event.type, event.data),
      recipients: [{ recipientIdentityId: session.ownerIdentityId, ...encrypted }],
      ...unread ? { unread } : {}
    };
    persist();
    await flushOutbox();
  }
  async function decrypt(envelope) {
    if (envelope.conversationId !== session.conversationId || Number(envelope.senderIdentityId) !== session.ownerIdentityId)
      throw Error("AGENT_SENDER_MISMATCH");
    if (session.ownerPublicKey && envelope.senderPublicKey?.x !== session.ownerPublicKey.x) throw Error("AGENT_OWNER_KEY_CHANGED");
    const packet = unpackMultiDeviceEnvelope(envelope.cryptoHeader, envelope.cipherText, session.deviceId);
    const context = {
      conversationId: envelope.conversationId,
      clientMessageId: envelope.clientMessageId,
      senderIdentityId: envelope.senderIdentityId,
      senderDeviceId: envelope.senderDeviceId,
      recipientIdentityId: session.identity.identityId,
      recipientDeviceId: packet.cryptoHeader.migrationMode ? "" : session.deviceId
    };
    const auth = await verifyEncryptedEnvelopeAuthentication({ ...packet, expectedContext: context });
    const binding = await verifyEncryptedEnvelopeIdentityBinding({
      ...packet,
      context,
      recipientIdentityPrivateKey: session.privateKey,
      senderIdentityPublicKey: envelope.senderPublicKey,
      senderDeviceProofPublicKey: auth.senderDeviceProofPublicKey
    });
    if (!auth.authenticated || !binding.identityBound) throw Error("AGENT_AUTHENTICATION_REQUIRED");
    let payload;
    if (isRatchetEnvelopeHeader(packet.cryptoHeader)) {
      const key = `${envelope.senderDeviceId}:${packet.cryptoHeader.sessionId}`;
      let ratchet = state.inbound[key];
      if (!ratchet) {
        const prekey = state.prekeys[packet.cryptoHeader.prekeyId];
        if (!prekey) throw Error("PREKEY_NOT_FOUND");
        ratchet = await createInboundRatchetSession(prekey.privateKey, packet.cryptoHeader, context);
      }
      const result = await decryptRatchetEnvelope(ratchet, packet.cryptoHeader, packet.cipherText);
      state.inbound[key] = result.state;
      delete state.prekeys[packet.cryptoHeader.prekeyId];
      payload = result.payload;
    } else payload = await decryptEnvelope(session.privateKey, packet.cryptoHeader, packet.cipherText);
    return payload;
  }
  let sendTail = Promise.resolve();
  const sendSerial = (event) => {
    const result = sendTail.then(() => send(event));
    sendTail = result.catch(() => {
    });
    return result;
  };
  return { request, ensurePrekeys, send: sendSerial, decrypt, flushOutbox };
}

// integrations/heming-agent/replyDelivery.mjs
function splitAgentReply(text, limit = 16384) {
  const chunks = [];
  for (let offset = 0; offset < text.length; ) {
    let end = Math.min(offset + limit, text.length);
    if (end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1])) end--;
    chunks.push(text.slice(offset, end));
    offset = end;
  }
  return chunks.length ? chunks : [""];
}
function createReplyDelivery({ channel, state, persist }) {
  async function update(job, text, status) {
    if (!job.created) {
      await channel.send(createChatEvent("message.create", {
        messageId: job.replyId,
        contentType: "text",
        text,
        agentReply: { requestMessageId: job.requestMessageId, revision: job.revision, state: status }
      }, { eventId: job.replyId }));
      job.created = true;
      persist();
      return;
    }
    job.revision++;
    job.text = splitAgentReply(text)[0];
    persist();
    await channel.send(createChatEvent("agent.reply", {
      targetMessageId: job.replyId,
      text: job.text,
      agentReply: { requestMessageId: job.requestMessageId, revision: job.revision, state: status }
    }));
  }
  function prepare(job, text, status) {
    job.finalStatus = status;
    job.parts = splitAgentReply(text).map((text2) => ({ id: crypto.randomUUID(), text: text2 }));
    job.deliveredParts = 0;
    persist();
  }
  async function finish(job) {
    await channel.flushOutbox();
    if (!job.finalStatus) prepare(job, "\u8FDE\u63A5\u4E2D\u65AD\uFF0C\u672C\u6B21\u4EFB\u52A1\u672A\u81EA\u52A8\u91CD\u8DD1\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u3002", "failed");
    if (!job.deliveredParts) {
      await update(job, job.parts[0].text, job.finalStatus);
      job.deliveredParts = 1;
      persist();
    }
    for (; job.deliveredParts < job.parts.length; ) {
      const part = job.parts[job.deliveredParts];
      await channel.send(createChatEvent("message.create", {
        messageId: part.id,
        contentType: "text",
        text: part.text,
        agentReply: { requestMessageId: job.requestMessageId, revision: 0, state: job.finalStatus }
      }, { eventId: part.id }));
      job.deliveredParts++;
      persist();
    }
    state.job = null;
    persist();
  }
  return { prepare, finish };
}

// integrations/heming-agent/abortable.mjs
function abortable(value, signal) {
  if (!signal) return Promise.resolve(value);
  return new Promise((resolve3, reject) => {
    const abort = () => reject(signal.reason || Error("AGENT_ABORTED"));
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    Promise.resolve(value).then(resolve3, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

// integrations/heming-agent/interactionDelivery.mjs
function createInteractionDelivery({ channel, state, persist }) {
  state.interactions ||= {};
  async function send(value, targetMessageId) {
    const interaction = normalizeAgentInteraction(value);
    if (interaction.ownerIdentityId !== String(state.session.ownerIdentityId)) throw Error("AGENT_RECIPIENT_MISMATCH");
    const text = `\u9700\u8981\u4F60\u7684\u6279\u51C6
${interaction.command}
${interaction.reason}
${approvalStatusLabel(interaction.status)}`;
    if (!targetMessageId) {
      if (interaction.requestMessageId !== state.job?.requestMessageId || interaction.status !== "pending" || interaction.revision !== 0)
        throw Error("AGENT_APPROVAL_TASK_MISMATCH");
      if (state.interactions[interaction.id]) throw Error("AGENT_APPROVAL_ALREADY_SENT");
      const id = crypto.randomUUID();
      const message = { id, senderIdentityId: state.session.identity.identityId, text, agentInteraction: interaction };
      state.interactions[interaction.id] = message;
      for (const [key, item] of Object.entries(state.interactions)) {
        if (Object.keys(state.interactions).length <= 128) break;
        if (item.agentInteraction.status !== "pending") delete state.interactions[key];
      }
      persist();
      await channel.send(createChatEvent("message.create", { messageId: id, contentType: "text", text, agentInteraction: interaction }, { eventId: id }));
      return id;
    }
    const previous = state.interactions[interaction.id];
    if (!previous || previous.id !== targetMessageId) throw Error("AGENT_APPROVAL_NOT_FOUND");
    const event = createChatEvent("message.edit", { targetMessageId, text, agentInteraction: interaction });
    const next = mergeAgentInteraction(previous, event, state.session.identity.identityId);
    if (next === previous) throw Error("AGENT_APPROVAL_STATE_CONFLICT");
    await channel.send(event);
    state.interactions[interaction.id] = next;
    persist();
    return targetMessageId;
  }
  return { send };
}

// integrations/heming-agent/connector.mjs
function createAgentConnector({ transport, store, onMessage, onAction = () => {
}, onStatus = () => {
}, taskTimeoutMs = 6e5 }) {
  const state = store.read();
  if (!state?.session?.token) throw Error("AGENT_PAIRING_REQUIRED");
  state.inbox ||= [];
  state.handledMessages ||= [];
  const persist = () => store.write(state);
  const channel = createSecureAgentChannel({ transport, state, persist });
  const delivery = createReplyDelivery({ channel, state, persist });
  const interactions = createInteractionDelivery({ channel, state, persist });
  let activeSync = null;
  let activeDrain = null;
  let started = false;
  let timer;
  async function execute(event, signal) {
    const job = { requestMessageId: event.data.messageId, replyId: crypto.randomUUID(), revision: 0, text: "", created: false };
    state.job = job;
    persist();
    const deadline = AbortSignal.timeout(taskTimeoutMs);
    const taskSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
    try {
      if (event.data.whisper || event.data.ephemeral) throw Error("AGENT_EPHEMERAL_UNSUPPORTED");
      if (event.data.contentType && event.data.contentType !== "text") throw Error("AGENT_MEDIA_UNSUPPORTED");
      const result = await abortable(onMessage({
        id: event.data.messageId,
        text: event.data.text,
        contentType: event.data.contentType,
        attachments: event.data.attachments || [],
        conversationId: state.session.conversationId,
        senderIdentityId: state.session.ownerIdentityId,
        signal: taskSignal
      }), taskSignal);
      let text = "";
      if (result?.[Symbol.asyncIterator]) {
        const iterator = result[Symbol.asyncIterator]();
        while (true) {
          const next = await abortable(iterator.next(), taskSignal);
          if (next.done) break;
          const delta = next.value;
          text = delta?.mode === "snapshot" ? String(delta.text || "") : text + String(delta || "");
          if (text.length > 131072) throw Error("AGENT_REPLY_LIMIT");
        }
      } else text = String(result?.text ?? result ?? "");
      taskSignal.throwIfAborted();
      if (!text.trim()) throw Error("AGENT_EMPTY_REPLY");
      if (text.length > 131072) throw Error("AGENT_REPLY_LIMIT");
      delivery.prepare(job, text, "completed");
    } catch (error) {
      const explanation = error.message === "AGENT_EPHEMERAL_UNSUPPORTED" ? "\u667A\u80FD\u4F53\u4E0D\u5904\u7406\u6084\u6084\u8BDD\uFF0C\u8BF7\u5728\u666E\u901A\u804A\u5929\u4E2D\u53D1\u9001\u3002" : error.message === "AGENT_MEDIA_UNSUPPORTED" ? "\u5F53\u524D\u667A\u80FD\u4F53\u8FDE\u63A5\u652F\u6301\u6587\u5B57\u548C Markdown\uFF0C\u6682\u4E0D\u652F\u6301\u5904\u7406\u9644\u4EF6\u3002" : "\u672C\u6B21\u56DE\u590D\u672A\u5B8C\u6210\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u3002";
      delivery.prepare(job, explanation, taskSignal.aborted ? "stopped" : "failed");
      onStatus("task-failed");
    }
    await delivery.finish(job);
  }
  async function sync(signal) {
    if (!activeSync) activeSync = (async () => {
      let more = true;
      while (more && !signal?.aborted) {
        const result = await channel.request("/api/v1/sync?limit=100", { signal });
        const pending = result.pending || [];
        more = pending.length >= 100;
        for (const envelope of pending) {
          if (!state.processed.includes(envelope.clientMessageId)) {
            const events = normalizeChatPayload(await channel.decrypt(envelope), envelope);
            const actions = [];
            for (const event of events) {
              if (event.type === "agent.action") {
                if (!state.handledMessages.includes(event.eventId)) {
                  actions.push(event);
                  state.handledMessages = [...state.handledMessages, event.eventId].slice(-4096);
                }
                continue;
              }
              if (event.type !== "message.create" || state.handledMessages.includes(event.data.messageId)) continue;
              state.inbox.push(event);
              state.handledMessages = [...state.handledMessages, event.data.messageId].slice(-4096);
            }
            state.processed = [...state.processed, envelope.clientMessageId].slice(-4096);
            persist();
            for (const action of actions) await onAction({
              ...action.data,
              eventId: action.eventId,
              conversationId: state.session.conversationId,
              senderIdentityId: state.session.ownerIdentityId
            });
          }
          await channel.request(`/api/v1/envelopes/${envelope.id}`, { method: "PATCH", body: { status: "read" }, signal });
        }
      }
    })().finally(() => {
      activeSync = null;
    });
    await activeSync;
    if (!activeDrain) activeDrain = (async () => {
      if (state.job) await delivery.finish(state.job);
      while (state.inbox.length && !signal?.aborted) {
        const event = state.inbox.shift();
        await execute(event, signal);
      }
    })().finally(() => {
      activeDrain = null;
    });
    return activeDrain;
  }
  async function start(signal) {
    if (started) throw Error("AGENT_ALREADY_STARTED");
    started = true;
    try {
      store.lock?.();
    } catch (error) {
      started = false;
      throw error;
    }
    try {
      await channel.ensurePrekeys();
      await channel.flushOutbox();
      if (state.job) await delivery.finish(state.job);
      timer = setInterval(() => {
        void sync(signal).catch(() => onStatus("reconnecting"));
      }, 15e3);
      timer.unref?.();
      let attempt = 0;
      while (!signal?.aborted) {
        try {
          await channel.request("/api/v1/bootstrap", { signal });
          await listenToSse({
            url: transport.origin + "/api/v1/events",
            token: state.session.token,
            signal,
            fetchImpl: transport.fetchImpl,
            onEvent: async (event) => {
              if (event.type === "agent.revoked") throw Object.assign(Error("AGENT_REVOKED"), { status: 403 });
              attempt = 0;
              onStatus("connected");
              void sync(signal).catch((error) => onStatus(error.status === 403 ? "revoked" : "reconnecting"));
            }
          });
        } catch (error) {
          if ([401, 403].includes(error.status) || error.message === "AGENT_REVOKED") throw error;
          onStatus("reconnecting");
          await delay2(Math.min(3e4, 1e3 * 2 ** Math.min(attempt++, 5)), void 0, { signal }).catch(() => {
          });
        }
      }
    } finally {
      clearInterval(timer);
      await activeSync?.catch(() => {
      });
      await activeDrain?.catch(() => {
      });
      store.unlock?.();
      started = false;
    }
  }
  async function sendText(text) {
    const id = crypto.randomUUID();
    await channel.send(createChatEvent("message.create", { messageId: id, contentType: "text", text }, { eventId: id }));
    return id;
  }
  return { start, sync, sendText, sendInteraction: interactions.send, session: state.session };
}

// integrations/heming-agent/stdioBridge.mjs
import { createInterface } from "node:readline";

// integrations/heming-agent/replyFeed.mjs
function createReplyFeed(signal) {
  let pending = null, done = false, error = null, wake;
  const notify = () => {
    wake?.();
    wake = null;
  };
  const abort = () => {
    error = signal.reason || Error("AGENT_ABORTED");
    done = true;
    notify();
  };
  if (signal?.aborted) abort();
  else signal?.addEventListener("abort", abort, { once: true });
  const finish = () => {
    done = true;
    signal?.removeEventListener("abort", abort);
    notify();
  };
  return {
    snapshot(text) {
      if (!done) {
        pending = { mode: "snapshot", text };
        notify();
      }
    },
    complete() {
      finish();
    },
    fail(reason) {
      error = reason;
      finish();
    },
    async *[Symbol.asyncIterator]() {
      while (true) {
        if (pending) {
          const value = pending;
          pending = null;
          yield value;
          continue;
        }
        if (error) throw error;
        if (done) return;
        await new Promise((resolve3) => {
          wake = resolve3;
        });
      }
    }
  };
}

// integrations/heming-agent/stdioBridge.mjs
function createStdioBridge({ input = process.stdin, emit: emit2 = (value) => process.stdout.write(JSON.stringify(value) + "\n"), signal }) {
  const lines = createInterface({ input, crlfDelay: Infinity });
  let active;
  let connector;
  lines.on("line", (line) => {
    try {
      if (line.length > 27e4) throw Error("BRIDGE_INPUT_LIMIT");
      const event = JSON.parse(line);
      if (event.type === "send" && connector && typeof event.text === "string" && event.text.length <= 16384) {
        if (event.conversationId !== connector.session.conversationId) throw Error("AGENT_RECIPIENT_MISMATCH");
        void connector.sendText(event.text).then(
          (id) => emit2({ type: "sent", nonce: event.nonce, messageId: id }),
          () => emit2({ type: "send-failed", nonce: event.nonce })
        );
      } else if (event.type === "interaction" && connector) {
        if (event.conversationId !== connector.session.conversationId) throw Error("AGENT_RECIPIENT_MISMATCH");
        void connector.sendInteraction(event.interaction, event.targetMessageId).then(
          (id) => emit2({ type: "sent", nonce: event.nonce, messageId: id }),
          () => emit2({ type: "send-failed", nonce: event.nonce })
        );
      } else if (active && event.requestId === active.id) {
        if (event.type === "snapshot" && typeof event.text === "string") active.feed.snapshot(event.text);
        else if (event.type === "complete") active.feed.complete();
        else if (event.type === "failed") active.feed.fail(Error("AGENT_PROVIDER_FAILED"));
      }
    } catch {
      emit2({ type: "bridge-error", code: "INVALID_BRIDGE_INPUT" });
    }
  });
  const close = () => {
    lines.close();
    active?.feed.fail(Error("AGENT_BRIDGE_CLOSED"));
  };
  signal?.addEventListener("abort", close, { once: true });
  lines.on("close", () => {
    active?.feed.fail(Error("AGENT_BRIDGE_CLOSED"));
  });
  return {
    attach(value) {
      connector = value;
    },
    onAction(action) {
      emit2({ type: "action", ...action });
    },
    onMessage(request) {
      const feed = createReplyFeed(request.signal);
      active = { id: request.id, feed };
      request.signal.addEventListener("abort", () => emit2({ type: "cancel", requestId: request.id }), { once: true });
      emit2({
        type: "message",
        requestId: request.id,
        text: request.text,
        conversationId: request.conversationId,
        senderIdentityId: request.senderIdentityId
      });
      return feed;
    },
    close
  };
}

// integrations/heming-agent/cli.mjs
var [command = "help", ...args] = process.argv.slice(2);
var option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : void 0;
};
var emit = (value) => process.stdout.write(JSON.stringify(value) + "\n");
var controller = new AbortController();
process.once("SIGINT", () => controller.abort());
process.once("SIGTERM", () => controller.abort());
try {
  if (!["pair", "bridge"].includes(command)) {
    process.stdout.write("\u548C\u9E23\u667A\u80FD\u4F53\u8FDE\u63A5\u5668\n  pair [--provider Hermes|OpenClaw|Custom] [--state \u6587\u4EF6]\n  bridge --state \u6587\u4EF6  \uFF08\u672C\u5730 JSONL \u534F\u8BAE\uFF09\n");
  } else {
    const store = createAgentStateStore(option("--state") || resolve2(homedir(), ".heming-agent/identity.json"));
    const transport = createAgentTransport({ origin: option("--origin") });
    const state = await ensureAgentPairing({
      transport,
      store,
      provider: option("--provider") || "Custom",
      signal: controller.signal,
      onQr: async ({ qr, expiresAt }) => {
        if (command === "bridge") emit({ type: "pairing", qr, expiresAt });
        process.stderr.write("\u7528\u548C\u9E23\u626B\u63CF\u4E8C\u7EF4\u7801\uFF0C\u7ED9\u673A\u5668\u4EBA\u8D77\u4E2A\u540D\u5B57\u3002\n" + await import_qrcode.default.toString(qr, { type: "terminal", small: true }));
      }
    });
    if (command === "pair") process.stdout.write("\u548C\u9E23\u5DF2\u8FDE\u63A5\u3002\n");
    else {
      const bridge = createStdioBridge({ signal: controller.signal });
      process.stdin.once("end", () => controller.abort());
      const connector = createAgentConnector({ transport, store, onMessage: bridge.onMessage, onAction: bridge.onAction, onStatus: (status) => emit({ type: "status", status }) });
      bridge.attach(connector);
      emit({ type: "ready", ownerIdentityId: state.session.ownerIdentityId, conversationId: state.session.conversationId });
      try {
        await connector.start(controller.signal);
      } finally {
        bridge.close();
      }
    }
  }
} catch (error) {
  if (!controller.signal.aborted) {
    process.stderr.write("\u548C\u9E23\u8FDE\u63A5\u672A\u5B8C\u6210\uFF1A" + (error.status === 403 ? "\u8FDE\u63A5\u5DF2\u89E3\u9664\uFF0C\u8BF7\u91CD\u65B0\u914D\u5BF9\u3002" : "\u8BF7\u68C0\u67E5\u7F51\u7EDC\u3001\u63D2\u4EF6\u7248\u672C\u6216\u672C\u673A\u8EAB\u4EFD\u6587\u4EF6\u3002") + "\n");
    process.exitCode = 1;
  }
}
/*! Bundled license information:

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/edwards.js:
@noble/curves/abstract/montgomery.js:
@noble/curves/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
