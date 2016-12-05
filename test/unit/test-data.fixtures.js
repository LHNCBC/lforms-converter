var testData = {
  "@a=@b AND @c=@d": {
    expected: {
      conditions: [
        {
          source: '@a',
          trigger: {
            value: '@b'
          }
        },
        {
          source: '@c',
          trigger: {
            value: '@d'
          }
        }
      ],
      logic: "AND"
    }
  },
  "@a=@b OR @c=@d": {
    expected: {
      conditions: [
        {
          source: '@a',
          trigger: {
            value: '@b'
          }
        },
        {
          source: '@c',
          trigger: {
            value: '@d'
          }
        }
      ],
      logic: "OR"
    }
  },
  "@a<@b AND @c>@d": {
    expected: {
      conditions: [
        {
          source: '@a',
          trigger: {
            maxExclusive: '@b'
          }
        },
        {
          source: '@c',
          trigger: {
            minExclusive: '@d'
          }
        }
      ],
      logic: "AND"
    }
  },
  "@a<=@b AND @c>=@d": {
    expected: {
      conditions: [
        {
          source: '@a',
          trigger: {
            maxInclusive: '@b'
          }
        },
        {
          source: '@c',
          trigger: {
            minInclusive: '@d'
          }
        }
      ],
      logic: "AND"
    }
  },
  "@a<=@b AND @c>=@d OR @e=@f": {
    expected: {
      conditions: [
        {
          source: '@a',
          trigger: {
            maxInclusive: '@b'
          }
        },
        {
          source: '@c',
          trigger: {
            minInclusive: '@d'
          }
        },
        {
          source: '@e',
          trigger: {
            value: '@f'
          }
        }
      ],
      logic: "AND"
    },
    warnings: ['Mixed boolean logic encountered. Only either all AND or all OR logic is supported.'],
    error: null
  },
  '"@x" = "c"': {
    expected: {
      conditions: [
        {
          source: '@x',
          trigger: {
            value: 'c'
          }
        }]
    },
    vars: ['@x', 'c']
  },
  "'@x' = 'c'": {
    expected: {
      conditions: [
        {
          source: '@x',
          trigger: {
            value: 'c'
          }
        }
      ]
    },
    vars: ['@x', 'c']
  },
  "'@x\"' = \"c'\"": {
    expected: {
      conditions: [
        {
          source: '@x"',
          trigger: {
            value: "c'"
          }
        }]
    },
    vars: ['@x"', "c'"]
  },
  "'@x\\\'' = \"@\\\"c\"": {
    expected: {
      conditions: [
        {
          source: "@x\\'",
          trigger: {
            value: '@\\"c'
          }
        }]
    },
    vars: ["@x\\'", '@\\"c']
  }
};