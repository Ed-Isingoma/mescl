document.addEventListener("DOMContentLoaded", async () => {
  const includeNodes = [...document.querySelectorAll("[data-include]")];

  await Promise.all(
    includeNodes.map(async (node) => {
      const path = node.getAttribute("data-include");

      try {
        const response = await fetch(path, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        node.outerHTML = await response.text();
      } catch (error) {
        node.innerHTML = `<div class="mx-auto max-w-6xl px-4 py-8 text-sm text-red-700">Unable to load ${path}</div>`;
        console.error(error);
      }
    })
  );

  document.dispatchEvent(new CustomEvent("mescl:includes-loaded"));
});

