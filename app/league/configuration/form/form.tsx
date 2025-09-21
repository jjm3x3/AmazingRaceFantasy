"use client";
import { MouseEvent } from "react";
import validationPattern from "@/app/dataSources/validationPatterns";
import styles from "./styles.module.scss";
import TextInput from "@/app/components/baseComponents/components/inputs/text/text";
import Select from "@/app/components/baseComponents/components/inputs/select/select";
import Button from "@/app/components/baseComponents/components/button/button";
export default function LeagueConfigurationForm(){
    const formSubmit = (e: MouseEvent<HTMLButtonElement>)=> { e.preventDefault(); };
    return (
        <form className={styles.form}>
            <TextInput
                label="Wikipedia Page Name"
                placeholder="example: big_brother"
                isRequired={true}
                validationPattern={validationPattern.wikiPageName.string}
                id="wikiPageUrl"
            />
            <TextInput
                label="Wiki Section Header"
                placeholder="example: HouseGuests"
                isRequired={true}
                validationPattern={validationPattern.wikiSectionHeader.string}
                id="castPhrase"
            />
            <TextInput
                label="League Key Prefix"
                placeholder="example: big_brother:27"
                isRequired={true}
                validationPattern={validationPattern.leagueKey.string}
                id="leagueKeyPrefix"
            />
            <TextInput
                label="Contestant Type"
                placeholder="example: team"
                isRequired={true}
                validationPattern={validationPattern.contestantType.string}
                id="contestantType"
            />
            <Select 
                labelText="League Status"
                selectOptions={
                    [{
                        value: "active",
                        text: "Active"
                    },{
                        value: "archived",
                        text: "Archived"
                    }]
                }
                id="league-status"
            />
            <TextInput
                label="Google Sheets Url"
                placeholder="example: https://docs.google.com/spreadsheets/d/testurl"
                isRequired={true}
                validationPattern={validationPattern.googleSheetsUrl.string}
                id="googleSheetsPageUrl"
            />
            <Button text="Create League"
                kind="primary"
                type="submit"
                clickHandler={formSubmit}
            />
        </form>
    );
}