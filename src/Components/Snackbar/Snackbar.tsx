import * as React from 'react';
import './Snackbar.scss'

export interface ISnackbarProps {
    isSnackbarOpen: boolean
    snackbarMessage: string
    setIsSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>
}

export function Snackbar({ isSnackbarOpen, snackbarMessage, setIsSnackbarOpen, setSnackbarMessage }: ISnackbarProps) {
    return (
        <div className={`Snackbar ${isSnackbarOpen ?'': ' -hide'}`}>
            { snackbarMessage }
        </div>
    );
}
