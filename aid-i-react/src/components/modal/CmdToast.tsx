interface Props {
  message: string;
}

export function CmdToast({ message }: Props) {
  return (
    <div className={`cmd-toast${message ? ' show' : ''}`}>
      {message}
    </div>
  );
}
