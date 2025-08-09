'use client';
import styles from "./styles.module.scss";
import TextInput from "@/app/components/baseComponents/components/inputs/text/text";
import Button from "@/app/components/baseComponents/components/button/button";
export default function LeagueConfigurationForm(){
    const formSubmit = ()=> {};
    return (
        <form className={styles.form}>
            <TextInput
                label="Show Name"
                placeholder="example: Big Brother"
                isRequired={true}
                inputType="text"
                id="showName"
            />
            <TextInput
                label="Season Number"
                placeholder="example: 28"
                isRequired={true}
                inputType="number"
                id="seasonNumber"
            />
            <TextInput
                label="Wikipedia Page Url"
                placeholder="example: https://wikipedia.org/big_brother"
                isRequired={true}
                inputType="text"
                id="wikiPageUrl"
            />
            <TextInput
                label="Google Sheets Url"
                placeholder="example: https://docs.google.com/spreadsheets/d/testurl"
                isRequired={true}
                inputType="text"
                id="googleSheetsPageUrl"
            />
            <TextInput
                label="Cast Phrase"
                placeholder="example: HouseGuests"
                isRequired={true}
                inputType="text"
                id="castPhrase"
            />
            <TextInput
                label="Competing Entity Name"
                placeholder="example: team"
                isRequired={true}
                inputType="text"
                id="competingEntityName"
            />
            <Button text="Create League"
                    kind="primary"
                    clickHandler={formSubmit}
            />
        </form>
    );
}