import { catSeries } from "../../src/lib/utils/utils";
import { expect, test } from "vitest";

test("catSeries groups items by a key", () => {
  const items = [
    { id: 1, category: "A" },
    { id: 2, category: "A" },
    { id: 3, category: "B" },
    { id: 4, category: "B" },
    { id: 5, category: "A" },
  ];

  const result = catSeries(items, "category");

  expect(result).toEqual([
    [
      { id: 1, category: "A" },
      { id: 2, category: "A" },
    ],
    [
      { id: 3, category: "B" },
      { id: 4, category: "B" },
    ],
    [{ id: 5, category: "A" }],
  ]);
});

test("catSeries groups items by a function", () => {
  const items = [
    { id: 1, category: "A" },
    { id: 2, category: "A" },
    { id: 3, category: "B" },
    { id: 4, category: "B" },
    { id: 5, category: "A" },
  ];

  const result = catSeries(items, (item) => item.category);

  expect(result).toEqual([
    [
      { id: 1, category: "A" },
      { id: 2, category: "A" },
    ],
    [
      { id: 3, category: "B" },
      { id: 4, category: "B" },
    ],
    [{ id: 5, category: "A" }],
  ]);
});

test("catSeries handles empty array", () => {
  const items: { id: number; category: string }[] = [];

  const result = catSeries(items, "category");

  expect(result).toEqual([]);
});

test("catSeries handles single item array", () => {
  const items = [{ id: 1, category: "A" }];

  const result = catSeries(items, "category");

  expect(result).toEqual([[{ id: 1, category: "A" }]]);
});
