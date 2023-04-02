
import getExample from './getExample';
const promptPrefix = `Using @innovaccer/design-system components create the code and return code only`;

export default (component, query) => {
  const example = getExample(component);

  return `Human: ${promptPrefix} ${example.query}
  AI: ${example.code}
  Human: ${query}
  `
}