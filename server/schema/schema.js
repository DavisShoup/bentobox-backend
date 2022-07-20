const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');



const RecipeType = new GraphQLObjectType({
    name: 'Recipe',
    fields: () => ({ 
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        steps: { type: GraphQLString },
        time: { type: GraphQLString },
        chef: {
            type: ChefType,
            resolve(parent, args){
                return Chef.findById(parent.chefId)
            },
        },
    }),
});

const ChefType = new GraphQLObjectType({
    name: 'Chef',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        recipes: {
            type: new GraphQLList(RecipeType),
            resolve(parent, args){
                return Recipe.find();
            }
        },
        recipe: {
            type: RecipeType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Recipe.findById(args.id);
            },
        },
        chefs: {
            type: new GraphQLList(ChefType),
            resolve(parent, args){
                return Chef.find();
            }
        },
        chef: {
            type: ChefType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Chef.findById(args.id);
            },
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addChef: {
            type: ChefType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                const chef = new Chef({
                    name: args.name,
                    email: args.email
                })
                return chef.save();
            },
        },
        deleteChef: {
            type: ChefType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},               
            },
            resolve(parent, args) {
                Recipe.find({ chefId: args.id }).then((recipes) => {
                    recipes.forEach(recipe => {
                        recipe.remove();
                    });
                });
                return Chef.findByIdAndRemove(args.id);
            }
        },
        addRecipe: {
            type: RecipeType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                steps: { type: GraphQLNonNull(GraphQLString)},
                time: { type: GraphQLNonNull(GraphQLString)},
                chefId: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                const recipe = new Recipe({
                    name: args.name,
                    steps: args.steps,
                    time: args.time,
                    chefId: args.chefId,
                });
                return recipe.save();
            },
        },
        deleteRecipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                return Recipe.findByIdAndRemove(args.id);
            }
        },
        updateRecipe: {
            type: RecipeType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString },
                steps: { type: GraphQLString },
                time: { type: GraphQLString }
            },
            resolve(parent, args){
                return Recipe.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            steps: args.steps,
                            time: args.time,
                        },
                    },
                    { new: true }
                )
            }
        }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});