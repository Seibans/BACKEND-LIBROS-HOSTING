const newDatos = ({ ...data }) => {

  const removeEmpty = (obj) =>
    Object.keys(obj)
      .filter(k => obj[k] !== null && obj[k] !== undefined && obj[k] !== '')
      .reduce((newObj, k) =>
        typeof obj[k] === 'object' ?
          Object.assign(newObj, { [k]: removeEmpty(obj[k]) }) :
          Object.assign(newObj, { [k]: obj[k] }),
        {});

  return removeEmpty(data);
}

module.exports = {
  newDatos,
};
