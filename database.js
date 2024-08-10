// NOTE: using expo v48 to run SQLite v11 to make proper use of SQLite.openDatabase because
//async versions were causing issues within the expo snack environment
// if testing within snack env, consider changing to expo v48 in the bottom right of the expo snack window
import * as SQLite from "expo-sqlite";
import { SECTION_LIST_MOCK_DATA } from "./utils";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("create table if not exists menu (id integer primary key not null, name text, price text, description text, category text, image text);");
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menu", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  console.log("saving menu items----", menuItems);
  db.transaction((tx) => {
    tx.executeSql(
      `insert into menu (name, price, description, category, image) values ${menuItems
        .map((item, idx) => `('${item.name}','${item.price}','${item.description}','${item.category}','${item.image}')`)
        .join(", ")} `
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // resolve(SECTION_LIST_MOCK_DATA);
    const queryWithWildcards = `%${query}%`;
    const placeholders = activeCategories.map(() => "?").join(", ");
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menu where name like ? and category in (${placeholders})`,
        [queryWithWildcards, ...activeCategories],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
}
