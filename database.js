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
        tx.executeSql(
          "create table if not exists menu (id integer primary key not null, name text, price text, description text, category text, image text);",
          [],
          (_, result) => {
            console.log("createTable success===>", result);
          },
          (_, error) => {
            console.log("createTable error===>", error);
          }
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from menu",
        [],
        (_, { rows }) => {
          console.log("getMenuItems success===>", rows._array);
          resolve(rows._array);
        },
        (_, error) => {
          console.log("getMenuItems error===>", error);
        }
      );
    });
  });
}

export async function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into menu(name, price, description, category, image) values${menuItems
          .map((item, idx) => `("${item.name}","${item.price}","${item.description}","${item.category}","${item.image}")`)
          .join(", ")}`,
        [],
        (_, result) => {
          console.log("insert successful ===> ", result);
          resolve(result);
        },
        (_, error) => {
          console.log("insert error ===> ", error);
        }
      );
    });
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // resolve(SECTION_LIST_MOCK_DATA);
    const queryWithWildcards = `%${query}%`;
    const placeholders = activeCategories.map(() => "?").join(", ");
    let sql = `select * from menu where category in (${placeholders})`;
    if (query.length > 0) {
      sql += ` AND name like '%${query}%'`;
    }
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [...activeCategories, queryWithWildcards],
        (_, { rows }) => {
          console.log("filter success===>", rows._array);

          resolve(rows._array);
        },
        (_, error) => {
          console.log("filter error===>", error);
          reject(error);
        }
      );
    });
  });
}
