export const handleGeneralError = (error, _req, res, _next) => {
  console.error({
    message: error.message,
    stack: error.stack,
  });

  res.status(500).send({
    message: "Something went wrong",
  });
};
