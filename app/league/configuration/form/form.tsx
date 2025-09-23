"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, MouseEvent } from "react";
import validationPattern from "@/app/dataSources/validationPatterns";
import styles from "./styles.module.scss";
import TextInput from "@/app/components/baseComponents/components/inputs/text/text";
import Select from "@/app/components/baseComponents/components/inputs/select/select";
import Button from "@/app/components/baseComponents/components/button/button";
export default function LeagueConfigurationForm(){
    // This is needed to allow for query selector below
    const formRef = useRef(null as HTMLFormElement | null);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const formSubmit = async (e: MouseEvent)=> { 
        e.preventDefault();
        if(formRef.current){
            const formData = new FormData(formRef.current);
            const formObject = Object.fromEntries(formData);
            const formDataAsJson = JSON.stringify(formObject);
            try{
                const response = await fetch("/api/league", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: formDataAsJson
                });
                if(!response.ok){
                    setErrorMsg("There was a problem. Please check the form and try to resubmit.");
                }
                const result = await response.json();
                if(result.message === "posted"){
                    router.push("/");
                }
            } catch(err){
                setErrorMsg("There was a problem. Please check the form and try to resubmit.");
            }
        }
    };
    return (
        <>
            <p>{errorMsg}</p>
            <form ref={formRef} className={styles.form}>
                <TextInput
                    label="Wikipedia Page Name"
                    placeholder="example: big_brother"
                    isRequired={true}
                    validationPattern={validationPattern.wikiPageUrl.string}
                    id="wikiPageName"
                />
                <TextInput
                    label="Wiki Section Header"
                    placeholder="example: HouseGuests"
                    isRequired={true}
                    validationPattern={validationPattern.wikiSectionHeader.string}
                    id="wikiSectionHeader"
                />
                <TextInput
                    label="League Key Prefix"
                    placeholder="example: big_brother:27"
                    isRequired={true}
                    validationPattern={validationPattern.leagueKey.string}
                    id="leagueKey"
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
                    id="leagueStatus"
                />
                <TextInput
                    label="Google Sheets Url"
                    placeholder="example: https://docs.google.com/spreadsheets/d/testurl"
                    isRequired={true}
                    validationPattern={validationPattern.googleSheetUrl.string}
                    id="googleSheetUrl"
                />
                <Button text="Create League"
                    kind="primary"
                    type="submit"
                    clickHandler={formSubmit} 
                />
            </form>
        </>
    );
}