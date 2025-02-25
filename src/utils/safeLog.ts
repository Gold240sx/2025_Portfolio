interface safeLogProps {
  display: boolean;
  log: Record<string, any>;
}

export const safeLog = ({ display, log }: safeLogProps) => {
  if (process.env.NODE_ENV === "development") {
    if (display) {
      console.log(log);
    } else {
      // console.debug(log)
    }
  }
};
