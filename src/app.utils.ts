export const showList = (todos) =>
  `Your todo list: \n\n ${todos
    .map(
      (todo) =>
        (todo.isCompleted ? "✅" : "⛔") +
        " " +
        todo.id +
        " " +
        todo.name +
        "\n\n"
    )
    .join(" ")}`
