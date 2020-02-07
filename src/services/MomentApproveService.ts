import MomentApprove from '../models/MomentApprove.model';
import { ApproveStatus } from '../models/ArticleApprove.model';

export default class MomentApproveService {
    public static async getApproves(momentId: number) {
        const momentApproves: MomentApprove[] = await MomentApprove.findAll({
            where: {
                momentId,
                status: ApproveStatus.Approve,
            },
        });

        return momentApproves.map((momentApprove) => {
            return momentApprove.userId;
        });
    }

    public static async  getDisApproves(momentId: number) {
        const momentApproves: MomentApprove[] = await MomentApprove.findAll({
            where: {
                momentId,
                status: ApproveStatus.Disapprove,
            },
        });

        return momentApproves.map((momentApprove) => {
            return momentApprove.userId;
        });
    }
}
