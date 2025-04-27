import type Item from "./Item";

const URL = import.meta.env.VITE_URL;

export const getData = async (isNextPage: boolean, searchQuery: string) => {
  try {
    const response = await fetch(
      `${URL}/api/items?is_next_page=${
        isNextPage ? 1 : 0
      }&new_search=${encodeURIComponent(searchQuery)}`
    );
    return (await response.json()) as { items: Item[]; total: number };
  } catch (error) {
    console.error("Error getData:", error);
    throw new Error();
  }
};

export const toggleSelection = async (item: Item) => {
  try {
    await fetch(`${URL}/api/items/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        selected: item.selected,
      }),
    });
  } catch (error) {
    console.error("Error toggleSelection:", error);
  }
};

export const setSearchQuery = async (searchQuery: string) => {
  try {
    await fetch(`${URL}/api/items/set-search-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: searchQuery,
      }),
    });
  } catch (error) {
    console.error("Error toggleSelection:", error);
  }
};

export const setOrder = async (draggedId: number, dropId: number) => {
  try {
    await fetch(`${URL}/api/items/set-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draggedId,
        dropId,
      }),
    });
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const BackService = { getData, toggleSelection, setOrder };
