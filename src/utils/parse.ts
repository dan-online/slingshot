function parsePath(paths: object, url: string) {
  const arrayPaths = Object.entries(paths).map((x) => ({
    key: x[0],
    val: x[1],
  }));
  const find:
    | {
      key: string;
      val: any;
    }
    | undefined = arrayPaths.find(
      (route) => route.val.path === url.split("?")[0],
      // new RegExp(route.val.path).test(url)
    );
  return find ? find.val : { cb: false };
}

export { parsePath };
