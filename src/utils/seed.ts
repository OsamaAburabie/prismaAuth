const seed = async () => {
  const postPromises: any = [];

  new Array(50).fill(0).forEach(() => {
    postPromises.push(
      prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
        },
      })
    );
  });

  const posts = await Promise.all(postPromises);
  console.log(posts);
};

seed()
  .catch((e) => process.exit(1))
  .finally(() => {
    prisma.$disconnect();
  });
