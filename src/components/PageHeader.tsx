import Link from "next/link";

type Props = {
  title: string;
  backText?: string;
  backHref?: string;
  hideBack?: boolean;
  content?: React.ReactNode;
};

const PageHeader = ({
  title,
  backText = "Back",
  backHref = "/",
  hideBack = false,
  content,
}: Props) => {
  return (
    <div className="flex items-center p-4 mx-4 sticky top-0 bg-white">
      {hideBack ? null : (
        <Link href={backHref} className="absolute left-0">
          ← {backText}
        </Link>
      )}
      <div className="mx-auto">{title}</div>
      {content && <div className="absolute right-0">{content}</div>}
    </div>
  );
};

export default PageHeader;
