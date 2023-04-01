
import getExample from './getExample';
const promptPrefix = `Using @innovaccer/design-system components`;

export default (component, query) => {
  const example = getExample(component);
  return [
    {
      role: "user",
      content: `${example.query} Use react component library @innovaccer/design-system components only.`,
    },
    { role: "assistant", content: example.code },
    {
      role: "user",
      content: `${query} Use react component library @innovaccer/design-system components only.`,
    },
  ];
}