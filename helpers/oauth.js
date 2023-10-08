const passport = require( 'passport' )
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {User} = require( '../models' );
const {generateAccessToken} = require( './jwt' );

passport.use( new GoogleStrategy( {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/google/callback",
    passReqToCallback: true,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async function ( request, accessToken, refreshToken, profile, done )
    {
        const email = profile.email
        const existingUser = await User.findOne( {where: {email: email}} );

        if ( existingUser ) {
            const user = existingUser.dataValues
            const token = generateAccessToken( {
                id: user,
                email: user.email,
                password: user.password,
                role: user.role
            } );
            done( null, token )
        } else {
            const newUser = await User.create( {
                name: profile.displayName,
                email: email,
                password: 'test123414!',
                role: 'customer'
            }, {} )

            const user = newUser.dataValues
            const token = generateAccessToken( {
                id: user,
                email: user.email,
                password: user.password,
                role: user.role
            });
            done( null, token )
        }
         done( null, profile )
    }
) );

passport.serializeUser( () => ( user, done ) =>
{
    console.log({user})
    done( null, {} )
} )