module.exports = {
  name: '@venusprotocol/yarn-plugin-generate-after-install',
  factory: require => {
    const { execFileSync } = require('node:child_process');
    const { npath } = require('@yarnpkg/fslib');

    return {
      hooks: {
        afterAllInstalled: project => {
          if (process.env.VENUS_SKIP_GENERATE_AFTER_INSTALL === '1') {
            return;
          }

          const yarnPath = process.env.npm_execpath || 'yarn';

          console.log('➤ YN0000: Running yarn generate');

          execFileSync(yarnPath, ['generate'], {
            cwd: npath.fromPortablePath(project.cwd),
            env: {
              ...process.env,
              VENUS_SKIP_GENERATE_AFTER_INSTALL: '1',
            },
            stdio: 'inherit',
          });
        },
      },
    };
  },
};
