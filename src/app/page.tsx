import { Alert } from "@/components/ui/alert";

type Props = {};

const Page = ({}: Props) => {
  return (
    <div className="p-4 space-y-2">
      <Alert
        heading="Hello"
        type="default"
        color="default"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="info"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="success"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="warning"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="danger"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="default"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="info"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="success"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="warning"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="default"
        color="danger"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="default"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="info"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="success"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="warning"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="danger"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="default"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="info"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="success"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="warning"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
      <Alert
        heading="Hello"
        type="inline"
        color="danger"
        variant="outline"
        children={<div>This is sample message.</div>}
      />
    </div>
  );
};

export default Page;
