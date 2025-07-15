interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div className="">Project Id: {projectId}</div>;
};

export default Page;
