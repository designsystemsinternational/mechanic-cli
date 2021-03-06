const path = require("path");
const fs = require("fs-extra");

const getConfig = async argvConfigPath => {
  const configPath = path.resolve(argvConfigPath);
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return;
  }
  return { config: require(configPath), configPath };
};

const getFunctionsPath = async (functionsPath, config) => {
  const relativePath = functionsPath || config.functionsPath || "./functions";
  const fullPath = path.resolve(relativePath);
  const exists = await fs.pathExists(fullPath);
  return exists ? fullPath : null;
};

module.exports = {
  getConfig,
  getFunctionsPath
};
