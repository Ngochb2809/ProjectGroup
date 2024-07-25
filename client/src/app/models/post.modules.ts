export class postListModel {
    contributionId!: number;
    title!: string;
    submissionDate: string = '';
    closureDate: string = '';
    content: string = '';
    selectedForPublication: boolean = true;
    commented: boolean = true;
    likes!: number;
    dislikes!: number;
    views!: number;
    userID!: string;
    facultyID: number = 0;
    status: number = 0;
    fileName: string = '';
    isLiked: boolean = false; // New property to track if post is liked
    isDisliked: boolean = false; // New property to track if post is disliked
    id!: number;
    eventID!: number;
}

export class commentModel {
    contributionId!: number;
    userId!: string;
    content!: string;
    date!: Date;
    id!: number;
    likes!: number;
    dislikes!: number;
    isAnonymous!: boolean;
}
export class Notification {
    notificationID!: number;
    userID!: string;
    notificationType!: number;
    contributionID!: number;
    content!: string;
    date!: Date;
}
export class UserModel {
    id!: string
    fullName!: string
    email!: string
    roles!: string[]
    phoneNumber!: string
    twoFacotrEnabled!: boolean
    phoneNumberConfirmed!: boolean
    accessFailedCount!: number
}
export class EventModel {
    eventID!: number;
    eventName: string = '';
    firstClosureDate: string = '';
    finalClosureDate: string = '';
    durationBetweenClosure: number | undefined;
    facultyID: number | undefined;
}
export class CommentOfCommentModel {
    id!: number;
    commentId!: number;
    userId: string = '';
    nullable!: boolean;
    content: string = '';
    date!: Date;
    isAnonymous: boolean = false;
    hidden: boolean = false;
}