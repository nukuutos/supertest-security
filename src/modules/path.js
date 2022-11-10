const path = require('path');

path.getRootDir = function () {
  return path.join(__dirname, '../../');
};

path.rootJoin = function (...rest) {
  const rootDir = this.getRootDir();
  const path = this.join(rootDir, ...rest);
  return path;
};
