import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://devapiv2.walcart.com/graphql",
    cache: new InMemoryCache(),
});

export default async (req, res) => {
    const body = req.body.split('?');
    const category = body[1];
    const parent = body[2];
    console.log("body", body);

    try {
        const { data } = await client.query({
            query: gql`
            {
            mutation {
createCategory(
category: {
name:"`+ category +`"
parentCategoryUid: "`+ parent +`"
}
)
{
message
statusCode
result {
uid
name
parent {
uid
name
}
parents {
uid
name
}
isActive
inActiveNote
createdAt
updatedAt
}
}
}
}
      `,
        });
        res.status(200).json({ characters: data.characters.results, error: null });
    } catch (error) {
        if (error.message === "404: Not Found") {
            res.status(404).json({ characters: null, error: "No Characters found" });
        } else {
            res
                .status(500)
                .json({ characters: null, error: "Internal Error, Please try again" });
        }
    }
};