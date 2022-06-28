export function getAllMessages (list) {
  const res = [];
  for (const message of list) {
    res.push(message);
    if (message.possible_answers) {
      for (const answer of message.possible_answers) {
        if (answer.fork) res.push(...getAllMessages(answer.fork));
      }
    }
  }
  return res;
}

export function getMessagesRows (list) {
  const raw = getAllMessages(list);
  const result = [];
  const getParentPath = (path) => path.split('.').slice(0, -1).join('.').slice(0, -1);
  let row = [];
  for (const messageIndx in raw) {
    const path = raw[messageIndx].path;
    const parentPath = getParentPath(path);
    const prefix = parentPath + path.slice(-1);
    if (!result.some(x => x.prefix === prefix)) {
      row.push(raw[messageIndx]);
      for (const subMessageIndx in raw) {
        if (subMessageIndx === messageIndx) continue;
        const subMessagePath = raw[subMessageIndx].path;
        const subMessageParentPath = getParentPath(subMessagePath);
        const subMessagePrefix = subMessageParentPath + subMessagePath.slice(-1);
        if (subMessagePrefix === prefix) {
          row.push(raw[subMessageIndx]);
        }
      }
    }
    if (!row.length) continue;
    result.push({
      prefix,
      data: row
    });
    row = [];
  }
  return result;
}

export function getMessageByPath (messages, path) {
  const paths = path.split('.');
  let result = messages;
  for (const strIndx in paths) {
    const indx = parseInt(strIndx);
    const path = paths[indx];
    result = result[parseInt(path[0])].possible_answers[parseInt(path[1])].fork;
  }
  return result;
}

export function validateMessages(messages) {
  for (const message of messages) {
    if (!message.text || !message.author) return false;
    if (message.possible_answers) {
      for (const answer of message.possible_answers) {
        if (!answer.text) return false;
        if (!answer.fork) continue;
        if (!validateMessages(answer.fork)) return false;
      }
    }
  }
  return true;
}

export function getAllAuthors(messages) {
  const authors = [];
  for (const message of messages) {
    if (!authors.includes(message.author)) authors.push(message.author);
    if (message.possible_answers) {
      for (const answer of message.possible_answers) {
        if (!answer.fork) continue;
        authors.push(...getAllAuthors(answer.fork).filter(x => !authors.includes(x)));
      }
    }
  }
  return authors;
}