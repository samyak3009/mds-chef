import examples from './stories.json';

const getStory = (name) => {
  const stories = examples[name.toLowerCase()] || {}
  const pickedOne = stories[Math.floor(Math.random() * stories.length)];
  return pickedOne;
}

export default (name) => {
  const {query, code} = getStory(name);
  return {
    query,
    code
  };
  // return {
  //   query: `create a card with heading and body with actions in footer`,
  //   code: `
  //   <Card shadow={shadow} className="w-50 Card-wrapper">
  //   <CardHeader>
  //     <Text weight="strong" size="large">
  //       Card Heading
  //     </Text>
  //   </CardHeader>
  //   <CardBody>
  //     <div>Card Body</div>
  //   </CardBody>
  //   <CardFooter className="justify-content-end">
  //     <>
  //       <Button appearance="basic">Cancel</Button>
  //       <Button appearance="primary" className="ml-4">
  //         Submit
  //       </Button>
  //     </>
  //   </CardFooter>
  // </Card>
  //   `,
  // };
}