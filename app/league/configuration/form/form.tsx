"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, MouseEvent } from "react";
import validationPattern from "@/app/dataSources/validationPatterns";
import styles from "./styles.module.scss";
import TextInput from "@/app/components/baseComponents/components/inputs/text/text";
import Select from "@/app/components/baseComponents/components/inputs/select/select";
import Button from "@/app/components/baseComponents/components/button/button";
import { UNAUTHENTICATED_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE, GENERIC_FORM_ERROR_MESSAGE, LEAGUE_NOT_FOUND_ERROR_MESSAGE } from "@/app/dataSources/errorMsgs";

interface FormError {
    status: number,
}

// A stored league, as the edit page hands it to the form
export interface EditableLeague {
    // Opaque to the form: sent back to the api as is, never built or parsed here
    leagueId: string,
    // Used only to link to the league's pages after saving
    urlSlug: string,
    wikiPageName: string,
    wikiSectionHeader: string,
    showName: string,
    showSeason: string,
    contestantType: string,
    leagueStatus: string,
    googleSheetUrl: string
}

export default function LeagueConfigurationForm({ league }: { league?: EditableLeague }){
    // This is needed to allow for query selector below
    const formRef = useRef(null as HTMLFormElement | null);
    const [errorMsg, setErrorMsg] = useState("");
    const [formValidation, setFormValidation] = useState(false);
    const router = useRouter();
    const isEditing = league !== undefined;

    // An edit starts out pre-filled, so it can be valid before any input changes
    useEffect(() => {
        if(formRef.current){
            setFormValidation(formRef.current.checkValidity());
        }
    }, []);

    const formSubmit = async (e: MouseEvent)=> {
        e.preventDefault();
        if(formRef.current){
            const formData = new FormData(formRef.current);
            const formObject = Object.fromEntries(formData);

            // Construct leagueKey based on user input (an edit can't change it, so it isn't sent)
            if(!isEditing){
                formObject.leagueKey = formObject.showName + ":" + formObject.showSeason;
            }

            // Convert "archived" friendly name into valid enum for api
            formObject.leagueStatus  = formObject.leagueStatus === "archived" ? "archive" : formObject.leagueStatus;

            const formDataAsJson = JSON.stringify(formObject);

            try{
                const response = await fetch(isEditing ? `/api/league/${encodeURIComponent(league.leagueId)}` : "/api/league", {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: formDataAsJson
                });
                if(!response.ok){
                    throw response;
                }
                const result = await response.json();
                if(result.message === "posted"){
                    router.push("/");
                } else if(result.message === "updated"){
                    router.push(`/${formObject.leagueStatus}/${league!.urlSlug}/league-details`);
                }
            } catch(err: unknown){
                console.log(err);
                setFormValidation(false);
                switch((err as FormError).status){
                case 401:
                    setErrorMsg(UNAUTHENTICATED_ERROR_MESSAGE);
                    break;
                case 403:
                    setErrorMsg(UNAUTHORIZED_ERROR_MESSAGE);
                    break
                case 404:
                    setErrorMsg(LEAGUE_NOT_FOUND_ERROR_MESSAGE);
                    break
                default:
                    setErrorMsg(GENERIC_FORM_ERROR_MESSAGE);
                }
            }
        }
    };
    return (
        <>
            {errorMsg && <p className={styles.errorMsg} data-testId={"leagueConfiguration-form-submission-error"}><span className={styles.errorIcon}>!</span>{errorMsg}</p>}
            <form ref={formRef} className={styles.form}>
                <TextInput
                    label="Wikipedia Page Name"
                    placeholder="example: big_brother"
                    isRequired={true}
                    validationPattern={validationPattern.wikiPageUrl.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="wikiPageName"
                    defaultValue={league?.wikiPageName}
                />
                <TextInput
                    label="Wiki Section Header"
                    placeholder="example: HouseGuests"
                    isRequired={true}
                    validationPattern={validationPattern.wikiSectionHeader.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="wikiSectionHeader"
                    defaultValue={league?.wikiSectionHeader}
                />
                <Select
                    labelText="Show Name"
                    selectOptions={
                        [{
                            value: "amazing_race",
                            text: "Amazing Race"
                        },{
                            value: "big_brother",
                            text: "Big Brother"
                        },{
                            value: "survivor",
                            text: "Survivor"
                        }]
                    }
                    id="showName"
                    defaultValue={league?.showName}
                    isDisabled={isEditing}
                />
                <TextInput
                    label="Show Season"
                    placeholder="example: 27"
                    isRequired={true}
                    validationPattern={validationPattern.frontend.showSeason}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="showSeason"
                    defaultValue={league?.showSeason}
                    isDisabled={isEditing}
                />
                <TextInput
                    label="Contestant Type"
                    placeholder="example: team"
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="contestantType"
                    defaultValue={league?.contestantType}
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
                    defaultValue={league?.leagueStatus === "archive" ? "archived" : league?.leagueStatus}
                />
                <TextInput
                    label="Google Sheets Url"
                    placeholder="example: https://docs.google.com/spreadsheets/d/testurl"
                    isRequired={true}
                    validationPattern={validationPattern.googleSheetUrl.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="googleSheetUrl"
                    defaultValue={league?.googleSheetUrl}
                />
                <Button text={isEditing ? "Update League" : "Create League"}
                    kind="primary"
                    type="submit"
                    id="leagueConfigurationSubmit"
                    clickHandler={formSubmit}
                    disabled={!formValidation}
                />
            </form>
        </>
    );
}
