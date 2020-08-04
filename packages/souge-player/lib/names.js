module.exports = (item, index) => {
  return `${index + 1} ${item.name} ${item.ar[0].name} ${item.al.name}`
}
