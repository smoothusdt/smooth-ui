import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    onLogout: () => void
}

export function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
    const [language, setLanguage] = useState('english')

    const handleLanguageChange = (value: string) => {
        setLanguage(value)
        // Here you would typically update the app's language setting
        console.log(`Language changed to ${value}`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-sm rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#339192]">Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="language" className="text-lg font-semibold mb-2 block">Language</label>
                        <Select onValueChange={handleLanguageChange} defaultValue={language}>
                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="russian">Русский</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full rounded-lg" variant="destructive" onClick={onLogout}>
                        Log Out
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

