export const delay = (millies: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), millies)
  })
