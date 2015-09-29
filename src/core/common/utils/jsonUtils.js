
export function stringify(data) {
  return JSON.stringify(data, function(key, value){
    return (key.startsWith('$')) ? undefined : value;
  });
}
