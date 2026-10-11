import { getPanchang, loadPanchang } from "../../data/panchang";
import { useAsync } from "../../hooks/useAsync";

function recover(result) {
  return {
    ...result,
    reload: () => {
      // Browsers retain a failed module import. A fresh document lets Retry
      // fetch the chunk again and also handles a newer deployed build.
      if (result.error?.name === "PanchangLoadError") window.location.reload();
      else result.reload();
    },
  };
}

export function usePanchang(date, city, detailed = false) {
  const result = recover(useAsync(() => getPanchang(date, city, detailed), [date, city, detailed]));
  const key = `${date}:${city}${detailed ? ":details" : ""}`;
  return { ...result, info: result.data?.key === key ? result.data.info : null };
}

export function useCities() {
  return recover(useAsync(async () => (await loadPanchang()).cities(), []));
}
