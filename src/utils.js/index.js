export function getAllMessages (list) {
  const res = [];
  for (const message of list) {
    if (message.text) res.push(message.text);
    if (message.possible_answers) {
      for (const answer of message.possible_answers) {
        if (answer.text) res.push(answer.text);
        if (answer.fork) res.push(...getAllMessages(answer.fork));
      }
    }
  }
  return res;
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