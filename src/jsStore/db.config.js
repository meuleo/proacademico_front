const schema = {
      name: "TesteDB",
      version: 3, // ← Aumente isso para atualizar estrutura
      tables: [
        {
          name: "Turma",
          columns: {
            id: { primaryKey: true, autoIncrement: true },
            nome: { dataType: "string", notNull: true },
            classe: { dataType: "string", notNull: true }
          }
        },
        {
          name: "Aluno",
          columns: {
            id: { primaryKey: true, autoIncrement: true },
            nome: { dataType: "string", notNull: true },
            classe: { dataType: "string", notNull: true }
          }
        }
      ]
    };