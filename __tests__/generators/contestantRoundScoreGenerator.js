import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator"
import { getTeamList } from "@/app/utils/wikiQuery"

describe("Regression Tests Checking generation of Archived Leagues", () => {

    it("Should return a league with rachels scoring for AmazingRace_35", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [{"name":"","name2":"Contestants\nAge\nRelationship\nHometown\nStatus","col1":"","col2":"","col3":"","col4":"","col5":""},{"name":"Alexandra Lichtor","name2":"Alexandra Lichtor","col1":"34","col2":"Siblings & Roommates","col3":"Chicago, Illinois","col4":"Eliminated 1st(in Mueang Nonthaburi, Thailand)","col5":""},{"name":"Sheridan Lichtor","name2":"Sheridan Lichtor","col1":"29","col2":"","col3":"","col4":"","col5":""},{"name":"Elizabeth Rivera","name2":"Elizabeth Rivera","col1":"52","col2":"Mother & Daughter","col3":"Tampa, Florida","col4":"Eliminated 2nd(in Sam Phran, Thailand)","col5":""},{"name":"Iliana Rivera","name2":"Iliana Rivera","col1":"27","col2":"","col3":"","col4":"","col5":""},{"name":"Jocelyn Chao","name2":"Jocelyn Chao","col1":"49","col2":"Married Entrepreneurs","col3":"Albuquerque, New Mexico","col4":"Eliminated 3rd(in Cần Thơ, Vietnam)","col5":""},{"name":"Victor Limary","name2":"Victor Limary","col1":"49","col2":"","col3":"","col4":"","col5":""},{"name":"Joe Moskowitz","name2":"Joe Moskowitz","col1":"35","col2":"Engaged","col3":"New York City, New York","col4":"Eliminated 4th(in Jaipur, India)","col5":""},{"name":"Ian Todd","name2":"Ian Todd","col1":"40","col2":"","col3":"","col4":"","col5":""},{"name":"Liam Hykel","name2":"Liam Hykel","col1":"23","col2":"Brothers","col3":"Cheyenne, Wyoming","col4":"Eliminated 5th(in Jaipur, India)","col5":""},{"name":"Yeremi Hykel","name2":"Yeremi Hykel","col1":"24","col2":"San Marcos, Texas","col3":"","col4":"","col5":""},{"name":"Andrea Simpson","name2":"Andrea Simpson","col1":"44","col2":"College Friends","col3":"Philadelphia, Pennsylvania","col4":"Eliminated 6th(in Cologne, Germany)","col5":""},{"name":"Malaina Hatcher","name2":"Malaina Hatcher","col1":"45","col2":"","col3":"","col4":"","col5":""},{"name":"Morgan Franklin","name2":"Morgan Franklin","col1":"31","col2":"Sisters","col3":"Brooklyn, New York","col4":"Eliminated 7th(in Ljubljana, Slovenia)","col5":""},{"name":"Lena Franklin","name2":"Lena Franklin","col1":"29","col2":"Los Angeles, California","col3":"","col4":"","col5":""},{"name":"Robbin Tomich","name2":"Robbin Tomich","col1":"41","col2":"Childhood Friends","col3":"Kirkland, Washington","col4":"Eliminated 8th(in Socerb, Slovenia)","col5":""},{"name":"Chelsea Day","name2":"Chelsea Day","col1":"41","col2":"Shoreline, Washington","col3":"","col4":"","col5":""},{"name":"Todd Martin","name2":"Todd Martin","col1":"38","col2":"Married High School Sweethearts","col3":"Chino, California","col4":"Eliminated 9th(in Stockholm, Sweden)","col5":""},{"name":"Ashlie Martin","name2":"Ashlie Martin","col1":"38","col2":"","col3":"","col4":"","col5":""},{"name":"Steve Cargile","name2":"Steve Cargile","col1":"54","col2":"Father & Daughter","col3":"Petty, Texas","col4":"Eliminated 10th(in Dublin, Ireland)","col5":""},{"name":"Anna Leigh Wilson","name2":"Anna Leigh Wilson","col1":"28","col2":"Royse City, Texas","col3":"","col4":"","col5":""},{"name":"Rob McArthur","name2":"Rob McArthur","col1":"48","col2":"Father & Son","col3":"Riverside, California","col4":"Third place","col5":""},{"name":"Corey McArthur","name2":"Corey McArthur","col1":"25","col2":"New York City, New York","col3":"","col4":"","col5":""},{"name":"Joel Strasser","name2":"Joel Strasser","col1":"42","col2":"Best Friends","col3":"Kuna, Idaho","col4":"Runners-up","col5":""},{"name":"Garrett Smith","name2":"Garrett Smith","col1":"43","col2":"Meridian, Idaho","col3":"","col4":"","col5":""},{"name":"Greg Franklin","name2":"Greg Franklin","col1":"25","col2":"Brothers & Computer Scientists","col3":"New York City, New York","col4":"Winners","col5":""},{"name":"John Franklin","name2":"John Franklin","col1":"27","col2":"Mountain View, California","col3":"","col4":"","col5":""}]
            );
        });

        const rachelsRawTeamList = [ "Ashlie Martin & Todd Martin", "Jocelyn Chao & Victor Limary", "Garrett Smith & Joel Strasser", "Lena Franklin & Morgan Franklin", "Ian Todd & Joe Moskowitz", "Corey McArthur & Rob McArthur", "Greg Franklin & John Franklin", "Liam Hykel & Yeremi Hykel", "Anna Leigh Wilson & Steve Cargile", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

        const rachelsContestantLeagueData = {
            name: "Rachel",
            userId: "E3BA8CF1-0F66-4911-88D8-A9ECFEEB37A7",
            ranking: rachelsRawTeamList,
        };
        const listOfContetantLeagueData = [rachelsContestantLeagueData]

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, getTeamList, listOfContetantLeagueData);

    });
});
