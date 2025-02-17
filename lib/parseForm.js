import formidable from "formidable";

export const parseForm = async (req) => {
  return new Promise(async (resolve, reject) => {
    // parse a file upload
    const form = formidable({});
    let fields;
    let files;
    [fields, files] = await form.parse(req);
    resolve({
      files,
      fields
    })
  })
}
