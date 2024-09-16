import Link from "next/link";

type Props = {
  heading: React.ReactNode;
  backText?: string;
  backHref?: string;
  hideBack?: boolean;
  content?: React.ReactNode;
};

const PageHeader = ({
  heading,
  backText = "Back",
  backHref = "/",
  hideBack = false,
  content,
}: Props) => {
  return (
    <div className="flex h-14 items-center mx-4 sticky top-0 bg-white">
      {hideBack ? null : (
        <Link
          href={backHref}
          className="group flex items-center gap-1 absolute left-0 text-blue-500"
        >
          <div className="">←</div>
          <div>{backText}</div>
        </Link>
      )}
      <div className="mx-auto">{heading}</div>
      {content && <div className="absolute right-0">{content}</div>}
    </div>
  );
};

export default PageHeader;
