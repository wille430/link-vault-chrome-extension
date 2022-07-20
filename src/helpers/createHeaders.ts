export const createHeaders = () =>
  new Promise<Record<any, any>>((resolve) => {
    chrome.storage.sync.get(["accessToken"], ({ accessToken }) => {
      resolve({
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      });
    });
  });
