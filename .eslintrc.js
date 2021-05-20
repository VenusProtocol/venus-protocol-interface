module.exports = {
    "env": {
      "browser": true,
      "es6": true,
      "jasmine": true,
    },
    "parser": "babel-eslint",
    "extends": ["airbnb", "plugin:prettier/recommended"],
    "plugins": ["jsx-a11y",  "prettier"],
    "rules": {
      "import/extensions": 0,
      "import/prefer-default-export": 0,
      "import/no-extraneous-dependencies": 0,
      "jsx-a11y/no-static-element-interactions": 0,
      "jsx-a11y/click-events-have-key-events": 0,
      "react/jsx-filename-extension": [1, {"extensions": [".js"]}],
      "react/jsx-one-expression-per-line": 0,
      "react/no-array-index-key": 0,
      "react/forbid-prop-types": 0,
      "react/destructuring-assignment": 0,
      "react/jsx-wrap-multilines": 0,
      "jsx-a11y/no-noninteractive-element-interactions": 0,
      "camelcase": 0,
    },
    "settings": {
      "import/resolver": {
        "node": {
          "paths": ["src"]
        }
      },
    },
  };