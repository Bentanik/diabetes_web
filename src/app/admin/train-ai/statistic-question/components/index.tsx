'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit3, Filter, Send } from "lucide-react"
import Header from "@/app/admin/train-ai/statistic-question/components/header"

interface QuestionData {
    id: string
    question: string
    answer: string
    isSelected: boolean
}

export default function StatisticQuestionComponent() {
    const [questions, setQuestions] = useState<QuestionData[]>([
        {
            id: "123",
            question: "Tại sao lại đau bụng",
            answer: "",
            isSelected: false
        },
        {
            id: "124",
            question: "Cách điều trị tiểu đường",
            answer: "Sử dụng thuốc theo chỉ định của bác sĩ asda sdas asd asd asd asd asbhk d akdjsh gasdkjhg  afdskhjgasfd kjghadsfkghj khjgd asfdsagj hkgsd hkafjgds ahjk dshjgkhjgskd ahk",
            isSelected: false
        },
        {
            id: "125",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "126",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "127",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "128",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "129",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },          

        {
            id: "130",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "131",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "132",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "133",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "134",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },                      
        {
            id: "135",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
        {
            id: "136",
            question: "Triệu chứng của bệnh tiểu đường  đá asd asd ad asd asd asd asd asd asd asd asd ád",
            answer: "",
            isSelected: false
        },
    ])

    const [filterType, setFilterType] = useState<'all' | 'answered' | 'unanswered'>('all')
    const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)
    const [answerText, setAnswerText] = useState("")

    const handleSelectAll = (checked: boolean) => {
        setQuestions(prev => prev.map(q => ({ ...q, isSelected: checked })))
    }

    const handleSelectQuestion = (id: string, checked: boolean) => {
        setQuestions(prev => prev.map(q => 
            q.id === id ? { ...q, isSelected: checked } : q
        ))
    }

    const handleFilterChange = (type: 'all' | 'answered' | 'unanswered') => {
        setFilterType(type)
    }

    const handleSubmitSelected = () => {
        const selectedQuestions = questions.filter(q => q.isSelected)
        console.log("Submitting selected questions:", selectedQuestions)
        // Xử lý submit ở đây
    }

    const handleEditAnswer = (question: QuestionData) => {
        setEditingQuestion(question)
        setAnswerText(question.answer)
    }

    const handleConfirmAnswer = () => {
        if (editingQuestion) {
            setQuestions(prev => prev.map(q => 
                q.id === editingQuestion.id 
                    ? { 
                        ...q, 
                        answer: answerText,
                        isSelected: answerText.trim() !== "" ? true : q.isSelected
                    }
                    : q
            ))
            setEditingQuestion(null)
            setAnswerText("")
        }
    }

    const handleDeleteQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id))
    }

    const handleCloseDialog = () => {
        setEditingQuestion(null)
        setAnswerText("")
    }

    const filteredQuestions = questions.filter(q => {
        if (filterType === 'answered') return q.answer.trim() !== ""
        if (filterType === 'unanswered') return q.answer.trim() === ""
        return true
    })

    const selectedCount = questions.filter(q => q.isSelected).length

    // Hàm để truncate text và hiển thị tooltip
    const TruncatedText = ({ text, maxLength = 50 }: { text: string, maxLength?: number }) => {
        if (text.length <= maxLength) {
            return <span>{text}</span>
        }

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">
                            {text.substring(0, maxLength)}...
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                        <p className="whitespace-pre-wrap">{text}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div className="p-6">
            <Header />
            
            <div className="mt-6 space-y-4">
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={() => handleFilterChange('all')}
                            variant={filterType === 'all' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Tất cả
                        </Button>
                        <Button 
                            onClick={() => handleFilterChange('answered')}
                            variant={filterType === 'answered' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Đã trả lời
                        </Button>
                        <Button 
                            onClick={() => handleFilterChange('unanswered')}
                            variant={filterType === 'unanswered' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Chưa trả lời
                        </Button>
                    </div>
                    
                    <Button 
                        onClick={handleSubmitSelected}
                        disabled={selectedCount === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Submit ({selectedCount})
                    </Button>
                </div>

                {/* Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox 
                                        checked={questions.length > 0 && questions.every(q => q.isSelected)}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-20">Id</TableHead>
                                <TableHead className="max-w-xs">Câu hỏi</TableHead>
                                <TableHead className="max-w-xs">Câu trả lời</TableHead>
                                <TableHead className="w-32">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQuestions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={question.isSelected}
                                            onCheckedChange={(checked) => 
                                                handleSelectQuestion(question.id, checked as boolean)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{question.id}</TableCell>
                                        <TableCell className="max-w-xs">
                                         <TooltipProvider>
                                             <Tooltip>
                                                 <TooltipTrigger asChild>
                                                     <span className="cursor-help">
                                                         <TruncatedText text={question.question} maxLength={70} />
                                                     </span>
                                                 </TooltipTrigger>
                                                 <TooltipContent className="max-w-xs">
                                                     <p className="whitespace-pre-wrap">{question.question}</p>
                                                 </TooltipContent>
                                             </Tooltip>
                                         </TooltipProvider>
                                     </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <Dialog open={editingQuestion?.id === question.id} onOpenChange={(open) => !open && handleCloseDialog()}>
                                             <DialogTrigger asChild>
                                                 <Button 
                                                     variant="outline" 
                                                     size="sm"
                                                     onClick={() => handleEditAnswer(question)}
                                                     className="w-full justify-start text-left h-auto min-h-[40px]"
                                                 >
                                                     <TruncatedText text={question.answer || "Nhập câu trả lời..."} maxLength={70} />
                                                 </Button>
                                             </DialogTrigger>
                                             <DialogContent className="sm:max-w-[600px] sm:max-h-[500px]" onEscapeKeyDown={handleCloseDialog} onInteractOutside={handleCloseDialog}>
                                                <DialogHeader>
                                                    <DialogTitle>Nhập câu trả lời</DialogTitle>
                                                    <DialogDescription>
                                                        Nhập câu trả lời cho câu hỏi: "{question.question}"
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-start gap-4">
                                                        <Label htmlFor="answer" className="text-right pt-2">
                                                            Câu trả lời
                                                        </Label>
                                                        <Textarea
                                                            id="answer"
                                                            value={answerText}
                                                            onChange={(e) => setAnswerText(e.target.value)}
                                                            className="col-span-3 min-h-[120px] max-h-[300px] resize-none overflow-y-auto" 
                                                            placeholder="Nhập câu trả lời..."              
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleConfirmAnswer}>
                                                        Xác nhận
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}