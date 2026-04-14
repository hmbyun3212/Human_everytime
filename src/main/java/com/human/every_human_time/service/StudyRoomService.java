package com.human.every_human_time.service;

import com.human.every_human_time.dto.request.StudyRoomReqDto;
import com.human.every_human_time.dto.response.StudyRoomResDto;
import com.human.every_human_time.entity.StudyRoom;
import com.human.every_human_time.entity.User;
import com.human.every_human_time.repository.StudyRoomRepository;
import com.human.every_human_time.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StudyRoomService {

    private final StudyRoomRepository studyRoomRepository;
    private final UserRepository userRepository;

    /** 좌석 예약 - 중복 체크 후 저장 */
    public StudyRoomResDto reserveSeat(Long userId, StudyRoomReqDto dto) {
        // 1. 사용자 존재 여부 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 이미 예약된 좌석인지 확인 (사용 중인 좌석이 있다면 에러 발생)
        studyRoomRepository.findByRoomIdAndSeatNumAndIsOccupied(dto.getRoomId(), dto.getSeatNum(), true)
                .ifPresent(s -> {
                    throw new IllegalArgumentException("이미 사용 중인 좌석입니다.");
                });

        // 3. 종료 시간 계산 (시작 시간 + 사용 시간)
        LocalDateTime endTime = dto.getStartTime().plusHours(dto.getUsageTime());

        // 4. StudyRoom 엔티티 생성
        StudyRoom studyRoom = StudyRoom.builder()
                .user(user)
                .roomId(dto.getRoomId())
                .seatNum(dto.getSeatNum())
                .startTime(dto.getStartTime())
                .usageTime(dto.getUsageTime())
                .endTime(endTime)
                .isOccupied(true)
                .build();

        // 5. 저장 후 DTO 반환
        StudyRoom saved = studyRoomRepository.save(studyRoom);
        log.info("열람실 예약 완료: ID={}, 좌석={}, 사용자={}", saved.getAssignId(), saved.getSeatNum(), user.getName());

        return StudyRoomResDto.from(saved);
    }

    /** 열람실 좌석 현황 조회 */
    @Transactional(readOnly = true)
    public List<StudyRoomResDto> getSeatStatus(Integer roomId) {
        return studyRoomRepository.findByRoomIdAndIsOccupied(roomId, true)
                .stream()
                .map(StudyRoomResDto::from)
                .toList();
    }

    /** 퇴실 (좌석 반납) */
    public void leaveSeat(Long assignId, Long userId) {
        StudyRoom studyRoom = studyRoomRepository.findById(assignId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        // 본인 확인
        if (!studyRoom.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 좌석만 반납할 수 있습니다.");
        }

        studyRoom.setIsOccupied(false);
        log.info("열람실 퇴실 완료: ID={}", assignId);
    }
}