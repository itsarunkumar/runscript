import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
} from "@tauri-apps/api/fs";

export async function upsertConfig(data?: any) {
  const filePath = "runscript/config.json";

  try {
    const isConfigExists = await exists(filePath, {
      dir: BaseDirectory.Home,
    });
    if (isConfigExists) {
      return;
    }
    await writeTextFile(
      filePath,
      JSON.stringify({
        name: "Runscript",
        ...data,
      }),
      {
        dir: BaseDirectory.Home,
      }
    );
  } catch (error) {
    console.error("Error in upsertConfig", error);
  }
}

export async function upsertDb(data?: any) {
  const filePath = "runscript/db.json";

  try {
    const isDbExists = await exists(filePath, { dir: BaseDirectory.Home });

    let newData = {
      name: "Runscript",
      folders: [],
    };

    if (isDbExists) {
      const prevData = JSON.parse(
        await readTextFile(filePath, { dir: BaseDirectory.Home })
      );

      newData = {
        ...prevData,
        ...data,
      };
    } else {
      newData = data;
    }

    await writeTextFile(filePath, JSON.stringify(newData), {
      dir: BaseDirectory.Home,
    });
  } catch (error) {
    console.error("Error in upsertDb:", error);
    // Optionally rethrow the error if you want to propagate it further
    // throw error;
  }
}

export async function upsertFolder(data?: any) {
  const filePath = "runscript/db.json";
  try {
    const isDbExists = await exists(filePath, { dir: BaseDirectory.Home });

    if (isDbExists) {
      const prevData = JSON.parse(
        await readTextFile(filePath, { dir: BaseDirectory.Home })
      );
      const oldData = prevData.folders || [];
      const ipre = oldData.some(
        (item: any) => item.folderName === data.folderName
      );
      console.log(ipre, "new data with old");
      if (ipre) {
        return;
      }

      await writeTextFile(
        filePath,
        JSON.stringify({
          folders: [...oldData, data],
        }),
        {
          dir: BaseDirectory.Home,
        }
      );
    } else {
      await writeTextFile(
        filePath,
        JSON.stringify({
          folders: [data],
        }),
        {
          dir: BaseDirectory.Home,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFolder(folderName: string) {
  const filePath = "runscript/db.json";

  console.log("delete folder", folderName);

  try {
    const prevData = JSON.parse(
      await readTextFile(filePath, { dir: BaseDirectory.Home })
    );

    const deleteF = prevData.folders.filter(
      (item: any) => item.folderName !== folderName
    );

    console.log(deleteF);

    const newData = {
      folders: [...deleteF],
    };

    await writeTextFile(filePath, JSON.stringify(newData), {
      dir: BaseDirectory.Home,
    });
  } catch (error) {
    console.error(error);
  }
}
